import { googleJWTAuth } from "../../googleCommonMethod";
// Function to delete a document on Google Drive by its ID
export const deleteDriveDocument = async (documentId: string): Promise<void> => {
  try {
    const service: any = await googleJWTAuth();
    const drive = service.drive;
    // Attempt to delete the document
    await drive.files.delete({
      fileId: documentId, // Pass the document ID here
    });
  } catch (error: any) {
      throw new Error(`Failed to delete document`);
  }
};
