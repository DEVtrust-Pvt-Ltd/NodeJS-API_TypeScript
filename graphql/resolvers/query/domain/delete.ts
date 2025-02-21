import { Document } from "../../../../database/document/doument";
import { Domain } from "../../../../database/domain/domain";
import { SubDomains } from "../../../../database/domain/subdomain";
import { deleteDriveFolder } from "../../../utility/google/driveFolder/delete";

// delete single domain
export const deleteDomainById = async (
  _: any,
  { id }: { id: string },
) => {
  try {
    // Update the domain to mark it as inactive
    const result = await Domain.update({ id }, { isActive: false, });
    if (result.affected === 0) throw new Error("No domain found to delete.");

    return "Domain deleted successfully";
  } catch (error) {
    throw new Error("Failed to delete Google Drive folder.");
  }
};

export const deleteDomainByIds = async (
  _: any,
  { ids }: { ids: string[] },
) => {
  try {
    for (const id of ids) {
      // Update the domain to mark it as inactive
      const result = await Domain.update({ id }, { isActive: false, });
      if (result.affected === 0) throw new Error("No domain found to delete.");
    }

    return "Domains deleted successfully";
  } catch (error) {
    throw new Error("Failed to delete Google Drive folder.");
  }
};

// Delete sub-Domain
export const deleteSubDomainById = async (
  _: any,
  { subDomainId }: { subDomainId: string },
) => {
  try {
    // Find the domain by ID and get the driveFolderId
    const driveFolderId = (await SubDomains.findOne({ where: { id: subDomainId } }))?.driveFolderId!;
    const result = await SubDomains.createQueryBuilder().delete().where({ id: subDomainId }).execute();
    if (result.affected === 0) throw new Error("No subdomain found to delete.");
    // delete document
    await Document.delete({ subDomain: subDomainId });
    // Delete sub-doamin by drive
    if (driveFolderId) {
      await deleteDriveFolder(driveFolderId);
    }

    return "Sub domain deleted successfully";
  } catch (error) {
    throw new Error("Failed to delete Google Drive folder.");
  }
};
