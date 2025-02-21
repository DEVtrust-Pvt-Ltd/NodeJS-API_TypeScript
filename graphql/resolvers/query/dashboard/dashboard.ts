import { Domain } from "../../../../database/domain/domain";
import { Login } from "../../../../database/auth/login";
import { Status } from "../../../../database/status/status";
import { Role } from "../../../../database/role/role";

export const getDashboardstats = async ( _: any)=> {
try {
    const statusId = (await Status.findOne({ where: { statusConstraint: "READY" } }))?.id;
    const readyDomainCount = await Domain.createQueryBuilder("domain")
      .where({ isActive: true })
      .andWhere({ status: statusId })
      .andWhere("domain.attorney IS NULL")
      .andWhere({ freelancers: []})
      .getCount();
    const attorneyDomainCount = await Domain.createQueryBuilder("domain")
      .where("domain.attorney IS NOT NULL")
      .andWhere({ freelancers: []})
      .getCount();
    const freelancersDomainCount = await Domain.createQueryBuilder("domain")
      .where("COALESCE(array_length(domain.freelancers, 1), 0) > 0")
      .andWhere({ status: statusId })
      .getCount();
    const roleaId = (await Role.findOne({ where: { roleConstraint: "ATTORNEY" } }))?.id;
    const activeAttorneycount = await Login.createQueryBuilder("user")
      .where("user.isActive = :isActive", { isActive: true })
      .andWhere("user.roleId = :roleId" , { roleId: roleaId })
      .getCount();
    const rolefId = (await Role.findOne({ where: { roleConstraint: "FREELANCER" } }))?.id;
    const activeFreelancercount = await Login.createQueryBuilder("user")
      .where("user.isActive = :isActive", { isActive: true })
      .andWhere("user.roleId = :roleId" , { roleId: rolefId })
      .getCount();
    return {
      readyDomainCount,
      activeAttorneycount,
      activeFreelancercount,
      attorneyDomainCount,
      freelancersDomainCount
    }
  } catch (error) {
    console.error("Error fetching domain count:", error);
    return {
      readyDomainCount: 0,
      activeAttorneycount:0,
      activeFreelancercount:0,
      attorneyDomainCount:0,
      freelancersDomainCount:0
      };
  }
};
