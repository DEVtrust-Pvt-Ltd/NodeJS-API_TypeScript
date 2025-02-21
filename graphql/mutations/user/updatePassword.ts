import { UpdatePasswordType } from "../../../types/user";
import bcrypt from 'bcrypt';
import { GraphQLContext } from "../../utility/graphql";
import { generateHash } from "../../utility/commonMethod";
import { Login } from "../../../database/auth/login";

export const updatePassword = async (
  _: any,
  {input }: {input : UpdatePasswordType },
  {userId}: GraphQLContext,
) => {
  try {
    const{oldPassword, newPassword } = input
    // Find the user by ID
    const user = await Login.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user?.password);
    if (!isMatch) {
      throw new Error('Incorrect old password');
    }
    // Hash the new password
    const hashedNewPassword = await generateHash(newPassword);
    // Update the user's password
    user.password = hashedNewPassword;
    // Save the updated user
    await user.save();
    return "Password changed successfully";
  } catch (error) {
    throw new Error('Internal server error');
  }
};
