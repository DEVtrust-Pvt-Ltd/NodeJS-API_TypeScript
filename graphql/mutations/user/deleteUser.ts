import { Login } from "../../../database/auth/login";
import { DeleteUser } from "../../../types/user";
import { GraphQLContext } from "../../utility/graphql";

export const deleteUser = async (
  _: any,
  { input }: { input: DeleteUser },
  { userId }: GraphQLContext
) => {
  try {
    const { id, isActive } = input;

    // Update the user's isActive status
    const updateResponse = await Login.createQueryBuilder()
      .update()
      .set({ isActive })
      .where({ id })
      .execute();

    // Check if any rows were affected
    if (updateResponse.affected === 0) {
      throw new Error("User not found");
    }

    // Retrieve the updated user data
    const updatedUser = await Login.findOne({ where: { id } });

    if (!updatedUser) {
      throw new Error("User not found after update");
    }

    return updatedUser;

  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw new Error('Internal server error');
  }
};
