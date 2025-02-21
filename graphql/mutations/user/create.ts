import MailService from "../../../config/mailService";
import { Login } from "../../../database/auth/login";
import { Role } from "../../../database/role/role";
import { SignUpUserTypeInput } from "../../../types/user";
import { dataLoaders } from "../../resolvers/dataloaders";
import { generateToken } from "../../resolvers/query/auth/auth";
import { AddUserTemplate } from "../../utility/templates/addUserTemplate";
import { generateHash, generateRandomAlphaString, validateFields } from "../../utility/commonMethod";
import yenv from "yenv";

const env = yenv("env.yaml", { env: "development" });

export const signUpUser = async (
  _: null,
  { input }: { input: SignUpUserTypeInput },

) => {
  const returnVal: any = {};
  const trimmedObj = input as any;
  const password = generateRandomAlphaString(10);
  const hashedPassword = await generateHash(password);

  // Check validation for each field
  const errors = validateFields(trimmedObj);
  if (errors) throw new Error(errors as any);

  const { emailIsDuplicated, errorMessage } = await checkEmailDuplication(input.email);
  if (emailIsDuplicated) throw new Error(errorMessage);

  const lowercaseEmail = trimmedObj.email.toLowerCase();
  const existingLogin = await Login.findOneBy({ email: lowercaseEmail });
  if (existingLogin) {
    throw new Error("Error: This email already exists.");
  }

  // Default role Id if you want to dynamically pass from FE and add in where condition
  const roleId = (await Role.findOne({ where: { roleConstraint: trimmedObj.role } }))?.id;

  // Insert new entity
  const response = await Login.createQueryBuilder()
    .insert()
    .values({ ...trimmedObj, email: lowercaseEmail, password: hashedPassword, roleId })
    .output("*")
    .execute();

  if (!Array.isArray(response.raw) || response.raw.length === 0) {
    throw new Error("Failed to create user");
  }

  const createdUser = response.raw[0];
  const rootUser = await dataLoaders.userLoader.clear(createdUser.id).load(createdUser.id);
  returnVal.token = await generateToken(rootUser);
  returnVal.info = rootUser;

  const basePath = env.CLIENT_URL;
  const urlLink = `${basePath}/login`;

  const mailService = MailService.getInstance();
  await mailService.sendMail(createdUser.id, {
    to: input.email,
    from: env.SMTP_SENDER,
    subject: "ADA Legal Team Portal Portal Invite",
    html: AddUserTemplate(
      input.email,
      urlLink,
      `${rootUser.firstName} ${rootUser.lastName}`,
      password
    ),
  });

  return returnVal;
};

interface UserDuplicationResult {
  emailIsDuplicated: boolean;
  errorMessage?: string;
}
export const checkEmailDuplication = async (
  email: string,
): Promise<UserDuplicationResult> => {
  let result: UserDuplicationResult = {
    emailIsDuplicated: false,
  };
  const sanitizedEmail = email.trim().toLowerCase();
  const userEmail = await Login.createQueryBuilder("user")
    .where("LOWER(TRIM(email)) like :email", {
      email: `${sanitizedEmail}%`,
    }).getOne();
  if (userEmail) {
    result = {
      emailIsDuplicated: true,
      errorMessage: `The email address provided is already registered.`,
    };
  }

  return result;
};
