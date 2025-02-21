import { Document } from "../../../../database/document/doument";
import { deleteDriveDocument } from "../../../utility/google/doc/delete";

// delete Document
export const deleteDocumentById = async (
  _: any,
  { id }: { id: string },
) => {
  const driveFileId = (await Document.findOne({ where: { id } }))?.driveFileId!;
  console.log("driveFileId", driveFileId);

  await deleteDriveDocument(driveFileId);
  const result = await Document.createQueryBuilder()
    .delete()
    .where({ id })
    .execute();
  if (result.affected === 0) throw new Error("No course found to delete.");

  return "Successfully deleted.";
};
