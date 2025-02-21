import { AttornayGenerateDocument } from "../../../database/document/attornayGenerateDocument";
import { Domain } from "../../../database/domain/domain";
import { Litigation } from "../../../database/litigation/litigation";
import { AttornayDashboardStatus } from "../../../database/status/attornayDashboardStatus";
import { UpdateDomain } from "../../../types/subdomain";
import { getStatusIdByConstraint } from "../../utility/commonMethod";
import { createFolder, moveFolder } from "../../utility/google/driveFolder/create";

// Utility function to update freelancers  if provided
const updateFreelancers = async (ids: string[], freelancers: string[], status: any) => {
  for (const id of ids) {
    await Domain.update({ id }, { freelancers, status });
  }
};

// update domain
const updateDomainData = async (id: string, rest: Partial<UpdateDomain>) => {
  await Domain.update({ id }, { ...rest });
};

// Utility function to update attorney  if provided
const updateAttorney = async (ids: [string], attorney: string, status: any) => {
  for (const id of ids) {
    await Domain.update({ id }, { attorney, status });
  }
};
// Utility function to update response  if provided
const updateResponse = async (id: string, response: string, emailSend: string) => {
  const result = await AttornayGenerateDocument.update({ domainId: id }, { response, emailSend });

  // If no records were updated, return a message
  if (result.affected === 0) {
    throw new Error(`Before  updating please create draft email`);
  }
};

const updateAttornayDashboardStatus = async (id: string, attornayDashboardStatus: string) => {
  await Domain.update({ id }, { attornayDashboardStatus, UpdatedAt: new Date() });
};
// update
export const updateDomain = async (
  _: any,
  { input }: { input: UpdateDomain; },
) => {
  const { id, attorney, attornayDashboardStatus, ids, freelancers, response, emailSend, ...rest } = input;

  // if freelancers
  if (freelancers !== undefined) {
    const freelancerId = await getStatusIdByConstraint("ASSIGNED_TO_FREELANCER");
    await updateFreelancers(ids, freelancers, freelancerId);
  }

  // if attorney
  if (attorney !== undefined) {
    const attorneyId = await getStatusIdByConstraint("ASSIGNED_TO_ATTORNEY");
    await updateAttorney(ids, attorney, attorneyId);
  }

  // if response
  if (response !== undefined || emailSend !== undefined) {
    await updateResponse(id, response, emailSend);
  }


  if (attornayDashboardStatus !== undefined) {
    await updateAttornayDashboardStatus(id, attornayDashboardStatus)
    const newFolderId = (await AttornayDashboardStatus.findOne({ where: { id: attornayDashboardStatus } }))?.driveFolderId;
    const oldFolderId = (await Domain.findOne({ where: { id } }))?.driveFolderId;
    if (newFolderId && oldFolderId) {
      const color = (await AttornayDashboardStatus.findOne({ where: { id: attornayDashboardStatus } }))?.color!;
      await moveFolder(oldFolderId, newFolderId, color)
    }
  }


  // update domain other fields
  if (Object.keys(rest).length > 0) {
    await updateDomainData(id, rest);
  }

  return "Domain updated successfully";
};


// Adjust the import based on your project structure

export const createAndStoreFolders = async (domainId: string, parentDriveId: string) => {
  const litigationFolder = await createFolder("Litigation", parentDriveId);
  const defendantFolder = await createFolder("Defendant", litigationFolder.id);
  const expertDocsFolder = await createFolder("Expert Docs", litigationFolder.id);
  const pleadingFolder = await createFolder("Pleading", litigationFolder.id);

  // Prepare the values to update in the database
  const values = {
    defendantDriveFolderId: defendantFolder.id,
    expertDocsDriveId: expertDocsFolder.id,
    pleadingDriveId: pleadingFolder.id,
    parentDriveId: litigationFolder.id
  };
  // Update the existing record in the database and return the updated data
  await Litigation.createQueryBuilder("login")
    .update()
    .set({ ...values })
    .where({ domainId })
    .output("*")
    .execute()
    .then((response) => {
      if (!Array.isArray(response.raw) || response.raw.length === 0) {
        throw new Error(`Failed to save`);
      }
    });

  return expertDocsFolder.id;
};

