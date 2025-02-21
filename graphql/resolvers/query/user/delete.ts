import { Login } from "../../../../database/auth/login";

// get user by id
export const deleteUserById = async (
  _: any,
  { id }: { id: string },
) => {
  const result = await Login.createQueryBuilder()
    .update()
    .set({ isActive: true })
    .where({ userId: id })
    .execute();
  if (result.affected === 0) throw new Error("No users found to delete.");

  return "Deleted successfully";
};
