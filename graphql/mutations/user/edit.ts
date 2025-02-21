import { Login } from "../../../database/auth/login";
import { UpdateSignUpUserTypeInput } from "../../../types/user";
import { validateFields } from "../../utility/commonMethod";

export const updateSignUpUser = async (
  _: null,
  { input }: { input: UpdateSignUpUserTypeInput },

) => {
  const trimmedObj = input as any;
  // Check validation for each field
  const errors = validateFields(trimmedObj);
  if (errors) throw new Error(errors as any);

  const { id, role,...rest } = trimmedObj;
  await Login.createQueryBuilder()
    .update({roleId:role,...rest})
    .where({ id })
    .output("*")
    .execute()
    .then((response) => {
      if (!Array.isArray(response.raw) || response.raw.length === 0) {
        throw new Error("Failed to update user data");
      }
    });



  return "Updated successfully";
};
