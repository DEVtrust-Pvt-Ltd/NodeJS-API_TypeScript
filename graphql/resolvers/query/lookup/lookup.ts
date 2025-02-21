import { Not } from "typeorm";
import { Login } from "../../../../database/auth/login";
import { Role } from "../../../../database/role/role";
import { AttornayDashboardStatus } from "../../../../database/status/attornayDashboardStatus";
import { Status } from "../../../../database/status/status";
import { getRoleIdByConstraint } from "../../../utility/commonMethod";
import { GraphQLContext } from "../../../utility/graphql";

// get all user, role and status
export const fetchUsersRolesAndStatuses = async (
  _: any,
  __: any,
  { userId }: GraphQLContext
) => {
  const attorneyId = await getRoleIdByConstraint("ATTORNEY");
  const managerId = await getRoleIdByConstraint("MANAGER");
  const freelancerId = await getRoleIdByConstraint("FREELANCER");
  const attorneys = await Login.find({ where: { roleId: attorneyId } });
  const managers = await Login.find({ where: { roleId: managerId } });
  const freelancers = await Login.find({ where: { roleId: freelancerId } });
  // const attornayDashboardStatus = await AttornayDashboardStatus.find();
  const attornayDashboardStatus = await AttornayDashboardStatus.createQueryBuilder("attornayDashboardStatus")
    .orderBy("attornayDashboardStatus.createdAt", "ASC")
    .getMany();

  const users = await Login.find({
    where: { id: Not(userId), },
  });
  const statuses = await Status.find();
  const roles = await Role.find();

  return { attorneys, managers, freelancers, statuses, roles, attornayDashboardStatus, users };
};
