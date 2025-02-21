
import { Domain } from "../../../database/domain/domain";
import { SubDomains } from "../../../database/domain/subdomain";
import { AttornayDashboardStatus } from "../../../database/status/attornayDashboardStatus";
import { getFormattedDate, trimUrl } from "../../utility/commonMethod";
import { createFolder } from "../../utility/google/driveFolder/create";
import { insertSubDomain } from "./createsubdomain";
export const updateDomainScore = async (
  _: any,
  { ids }: { ids: string[] },
) => {
  // Fetch domains with null scores
  let query = Domain.createQueryBuilder("domain")
    .where("(domain.driveFolderId IS NULL OR domain.driveFolderId = '')")
    .andWhere({ isActive: true })
    .andWhere("domain.id IN (:...ids)", { ids });
  const domains = await query.getMany();

  // get scan date
  const scanDate = getFormattedDate();

  // Iterate over each domain and call the API to get the score
  for (const domain of domains) {

    // Update the domain score in the database
    const statusId = (await Domain.findOne({ where: { id: domain.id } }))?.attornayDashboardStatus;
    const color = (await AttornayDashboardStatus.findOne({ where: { id: statusId } }))?.color!;
    // cretae all status drive folder
    const statuses = await AttornayDashboardStatus.find();
    for (const status of statuses) {
      const statusName = status.statusName;
      const folder = await createFolder(statusName);
      await AttornayDashboardStatus.update({ statusName }, { driveFolderId: folder.id });
    }

    // Get status folder
    const status = (await AttornayDashboardStatus.findOne({ where: { id: domain.attornayDashboardStatus } }))?.statusName!;

    // creating status folder
    const statusFolder = await createFolder(status);
    const stateId = statusFolder.id;
    const domainName = trimUrl(domain.domainName);
    // for creating domain
    const domainFolder = await createFolder(`${domainName} - ${scanDate} `, stateId, color);

    // crete doc subfolder
    const subDocFolder = await createFolder(`Scan Report & Video regarding ${domainName} - ${scanDate} `, domainFolder.id);
    await Domain.update({ id: domain.id }, { driveFolderId: domainFolder.id,  scanDate, scanReportDriveId: subDocFolder.id });
    // Create default subdomain and subfolder under domain folder
    const sanitizedInput: Partial<any> = { domainId: domain.id, subDomainName: domain.domainName };
    const subdomain = await insertSubDomain(sanitizedInput);
    const subDomainName = trimUrl(subdomain.subDomainName);
    const subFolder = await createFolder(subDomainName, subDocFolder.id);
    if (subFolder instanceof Error) { continue; }
    const subDriveFolderId = subFolder?.id;
    await SubDomains.update({ id: subdomain.id }, { driveFolderId: subDriveFolderId });
  }
  return "Domain updated with Score";
};



