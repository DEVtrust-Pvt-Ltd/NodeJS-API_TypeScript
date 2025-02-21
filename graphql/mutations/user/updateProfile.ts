import { Login } from "../../../database/auth/login";
import { UpdateProfile } from "../../../types/user";
import { validateFields } from "../../utility/commonMethod";
import { GraphQLContext } from "../../utility/graphql";

export const updateProfile = async (
  _: any,
  { input }: { input: UpdateProfile },
  { userId }: GraphQLContext
) => {
  try {
    const trimmedObj = input as any;
    // Check validation for each field
    const errors = validateFields(trimmedObj);
    if (errors) throw new Error(errors as any);
    // Find the user by id
    const user = await Login.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    user.firstName = input.firstName;
    user.lastName = input.lastName;
    await user.save();

    return user;
  } catch (error) {
    throw new Error('Internal server error');
  }
};
