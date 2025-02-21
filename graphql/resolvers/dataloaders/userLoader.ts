import { Login } from "../../../database/auth/login";
import { Role } from "../../../database/role/role";

export const getUsers = async (
  userIds: readonly string[]
): Promise<Login[]> => {
  const userMap: Map<string, Login> = new Map();
  const _ids = userIds.map((id) => `${id}`);
  (await Login.findByIds(_ids)).map((user) => userMap.set(user.id, user));

  return _ids.map((inputId) => userMap.get(inputId) || null) as Login[];
};

// create function for get roles by ids
export const roleById = async (ids: readonly string[]): Promise<Role[]> => {
  const RoleMap: Map<string, Role> = new Map();
  const _ids = ids.map((id) => `${id}`);
  (await Role.findByIds(_ids)).forEach((f) => RoleMap.set(f.id, f));

  const roles = ids
    .map((id) => RoleMap.get(id))
    .filter((role): role is Role => role !== undefined);

  return roles;
};
