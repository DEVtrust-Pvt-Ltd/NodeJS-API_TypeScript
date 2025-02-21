import { googleJWTAuth } from "../../googleCommonMethod";

// delete folder on drive
export const deleteDriveFolder = async (folderId: string): Promise<void> => {
  try {
    const service: any = await googleJWTAuth();
    const drive = service.drive;

    try {
      await drive.files.delete({
        fileId: folderId,
      });
      console.log(`Folder with ID ${folderId} deleted successfully.`);
    } catch (error: any) {
      console.error(`Error deleting folder with ID ${folderId}:`, error.message || error);
    }
  } catch (error: any) {
    console.error("Error authenticating with Google Drive:", error.message || error);
  }
};
