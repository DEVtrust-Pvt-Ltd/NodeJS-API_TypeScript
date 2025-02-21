import yenv from 'yenv';
import { googleJWTAuth } from '../../googleCommonMethod';
import { PassThrough } from 'stream';
const env = yenv("env.yaml", { env: "development" });

// Create Folder on Google Drive
export async function createFolder(folderName: string, parentFolderId?: string | null, color?: string | null) {
  try {
    const effectiveParentId = parentFolderId || env.GOOGLE_DRIVE_FOLDER_ID;
    const service: any = await googleJWTAuth();
    const drive = service.drive;

    // Check for existing folder
    const existingFolders = await drive.files.list({
      q: `name = '${folderName}' and '${effectiveParentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name)',
    });
    if (existingFolders.data.files && existingFolders.data.files.length > 0) {
      return existingFolders.data.files[0]; // Return the first found folder
    }

    // Create a new folder if it does not exist
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [effectiveParentId],
    };

    const createResponse = await drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });

    const folderId = createResponse.data.id;

    // If a color is provided, update the folder with the color
    if (color) {
      await drive.files.update({
        fileId: folderId,
        resource: {
          folderColorRgb: color ?? '#808080'
        }
      });
    }

    return createResponse.data;
  } catch (error) {
    console.error('Error creating folder:', error);
    return null;
  }
}



// Function to list all folder IDs within a given folder
export const listFoldersInFolder = async (parentFolderId: any): Promise<string[]> => {
  try {
    const service: any = await googleJWTAuth(); // Ensure this function returns a proper authenticated Google API client
    const drive = service.drive;
    const response = await drive.files.list({
      q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    const folders = response.data.files;
    return (folders || []).map((folder: any) => folder.id || '');
  } catch (error) {
    console.error('Error listing folders:', error);
    throw new Error('Failed to retrieve folder IDs');
  }
};


// move folder
export const moveFolder = async (oldFolderId: string, newFolderId: string, color?: string | null): Promise<void | null> => {
  try {
    const service: any = await googleJWTAuth();
    const driveService = service.drive;

    // Get the current metadata of the folder to get the existing parent(s)
    const file = await driveService.files.get({
      fileId: oldFolderId,
      fields: 'parents',
    });

    // Get the current parent ID(s)
    const previousParents = file.data.parents?.join(',') || '';

    // Move the folder to the new folder by updating the parents
    await driveService.files.update({
      fileId: oldFolderId,
      addParents: newFolderId,
      removeParents: previousParents,
      fields: 'id, parents',
    });

    // Update the folder color
    if (color) {
      await driveService.files.update({
        fileId: oldFolderId,
        resource: {
          folderColorRgb: color,
        },
        fields: 'id, folderColorRgb',
      });
    }
  } catch (error) {
    console.error('Error moving or updating folder color:', error);
    return null;
  }
};

// Move doc into PDF and handle duplicate PDF names
export async function copyDocAsPdf(docId: string, name: string, folderId: string): Promise<string | null> {
  try {

    const service = await googleJWTAuth();
    const drive = service?.drive;

    // Step 1: Check if a PDF with the same name already exists in the folder
    const existingFiles = await drive?.files.list({
      q: `name='${name}.pdf' and '${folderId}' in parents and mimeType='application/pdf' and trashed=false`,
      fields: 'files(id, name)',
    });

    const existingFileId = existingFiles?.data.files?.[0]?.id;
    if (existingFileId) {
      await drive?.files.delete({ fileId: existingFileId });
    }

    // Step 2: Convert the .docx file to Google Docs format
    const convertedFileMetadata = {
      name: 'ConvertedDoc',
      mimeType: 'application/vnd.google-apps.document',
    };

    const convertedFileResponse = await drive?.files.copy({
      fileId: docId,
      requestBody: convertedFileMetadata,
    });

    const convertedFileId = convertedFileResponse?.data.id!;

    // Step 3: Export the converted Google Docs file as a PDF
    const pdfStream = new PassThrough();
    const exportResponse = await drive?.files.export(
      { fileId: convertedFileId, mimeType: 'application/pdf' },
      { responseType: 'stream' }
    );

    exportResponse?.data.pipe(pdfStream);

    // Step 4: Upload the PDF directly to Google Drive in the specified folder
    const fileMetadata = {
      name: `${name}.pdf`,
      mimeType: 'application/pdf',
      parents: [folderId],
    };

    const uploadResponse = await drive?.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: 'application/pdf',
        body: pdfStream,
      },
      fields: 'id',
    });

    const pdfFileId = uploadResponse?.data.id!;

    // Step 5: Optional clean-up by deleting the converted Google Docs file
    await drive?.files.delete({ fileId: convertedFileId });

    return pdfFileId;
  } catch (error: any) {
    return null;
  }
}

export async function copyXlsxAsPdf(docId: string, name: string, folderId: string): Promise<string | null> {
  try {
    const service = await googleJWTAuth();
    const drive = service?.drive;

    // Step 1: Check if a PDF with the same name already exists in the folder
    const existingFiles = await drive?.files.list({
      q: `name='${name}.pdf' and '${folderId}' in parents and mimeType='application/pdf' and trashed=false`,
      fields: 'files(id, name)',
    });

    const existingFileId = existingFiles?.data.files?.[0]?.id;
    if (existingFileId) {
      await drive?.files.delete({ fileId: existingFileId });
    }

    // Step 2: Convert the .xlsx file to Google Sheets format
    const convertedFileMetadata = {
      name: 'ConvertedSheet',
      mimeType: 'application/vnd.google-apps.spreadsheet',
    };

    const convertedFileResponse = await drive?.files.copy({
      fileId: docId,
      requestBody: convertedFileMetadata,
    });

    const convertedFileId = convertedFileResponse?.data.id!;

    // Step 3: Export the converted Google Sheets file as a PDF
    const pdfStream = new PassThrough();
    const exportResponse = await drive?.files.export(
      { fileId: convertedFileId, mimeType: 'application/pdf' },
      { responseType: 'stream' }
    );

    exportResponse?.data.pipe(pdfStream);

    // Step 4: Upload the PDF directly to Google Drive in the specified folder
    const fileMetadata = {
      name: `${name}.pdf`,
      mimeType: 'application/pdf',
      parents: [folderId],
    };

    const uploadResponse = await drive?.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: 'application/pdf',
        body: pdfStream,
      },
      fields: 'id',
    });

    const pdfFileId = uploadResponse?.data.id!;

    // Step 5: Optional clean-up by deleting the converted Google Sheets file
    await drive?.files.delete({ fileId: convertedFileId });

    return pdfFileId;
  } catch (error: any) {
    console.error('Error converting .xlsx to PDF:', error);
    return null;
  }
}

// update domain folder on google drive
export async function updateFolderMetadata(folderId: string, newName: string) {
  try {
    const service: any = await googleJWTAuth();
    const drive = service.drive;
    const res = await drive.files.update({
      fileId: folderId,
      requestBody: {
        name: newName, // New folder name
      },
      fields: 'id, name',
    });

    return res.data;
  } catch (error) {
    return ''
  }
}

