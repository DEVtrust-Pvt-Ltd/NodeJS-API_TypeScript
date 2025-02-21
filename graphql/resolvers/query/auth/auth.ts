import { Login } from "../../../../database/auth/login";
import jwt from "jsonwebtoken";
import yenv from "yenv";
import bcrypt from "bcrypt";
import { dataLoaders } from "../../dataloaders";
import { GraphQLContext } from "../../../utility/graphql";
import { validateFields } from "../../../utility/commonMethod";
const env = yenv("env.yaml", { env: "development" });

export const loginResolver = async (
  _: any,
  { email, password }: { email: string; password: string }
) => {
  let login!: Login;
  let isPasswordMatch;
  let _userId!: string;

  // Check validation for each field
  const errors = validateFields({ email, password });
  if (errors) throw new Error(errors as any);

  const returnVal: any = {};
  // Convert loginName to lowercase
  const lowercaseLoginName = email.toLowerCase();
  if (email && password) {
    login = (await Login.findOneBy({ email: lowercaseLoginName })) as Login;
    if (login.isActive) {
      if (login) {
        isPasswordMatch = await bcrypt.compare(password, login.password);
      }
      if (!login || !isPasswordMatch) {
        throw new Error(`Email and password do not match`);
      }
    }
    else {
      throw new Error(`Your account is suspended`);
    }
    _userId = login.id;
  }
  const rootUser = await dataLoaders.userLoader.clear(_userId).load(_userId);
  returnVal.token = await generateToken(rootUser);
  returnVal.info = rootUser;

  return returnVal;
};

// function for genrate token
export const generateToken = async (login: Login) => {
  const tokenPayload = {
    id: login.id,
    email: login.email,
  };
  const now = new Date();
  const nowInSeconds = Math.round(now.getTime() / 1000);
  const exp = in1Day(nowInSeconds);
  const secret = env.JWT_SECRET;
  const token = jwt.sign(
    {
      ...tokenPayload,
      iat: nowInSeconds,
      exp,
    },
    secret
  );

  return { token };
};
const secondsPerDay = 86400;
const in1Day = (nowInSeconds: number): number => {
  return nowInSeconds + secondsPerDay;
};

// get user profile
export const getUserProfile = async (_: any, __: any, { userId }: GraphQLContext) => {
  const user = await Login.findOne({ where: { id: userId } });

  return user;
};
