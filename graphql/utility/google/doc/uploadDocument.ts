
import { googleJWTAuth } from "../../googleCommonMethod";
import fs from 'fs';
import yenv from "yenv";
const env = yenv("env.yaml", { env: "development" });
// upload on drive
export async function uploadFileToDrive(
  filePath: string,
  mimeType: string,
  driveFolderId: string,
  newFileName: string
) {
  const service = await googleJWTAuth();
  const drive = service?.drive;

  if (!drive) throw new Error('Google Drive client authentication failed');
  if (!driveFolderId) throw new Error('Please provide a valid folder ID.');
  if (!fs.existsSync(filePath)) throw new Error(`File does not exist`);

  try {
    // Search for a file with the same name in the folder
    const searchResponse = await drive.files.list({
      q: `'${driveFolderId}' in parents and name='${newFileName}' and trashed=false`,
      fields: 'files(id, name)',
    });

    const existingFiles = searchResponse.data.files || [];
    if (existingFiles.length > 0) {
      // Delete the existing file
      for (const file of existingFiles) {
        if (file.id) {
          await drive.files.delete({ fileId: file.id });
        }
      }
    }

    // Upload the new file
    const fileMetadata = {
      name: newFileName,
      parents: [driveFolderId],
    };

    const media = {
      mimeType,
      body: fs.createReadStream(filePath),
    };

    const uploadResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    const fileId = uploadResponse.data.id;
    const webViewLink = uploadResponse.data.webViewLink;
    const downloadLink = `${env.DRIVE_URL}/uc?id=${fileId}&export=download`;

    // Remove the local file after successful upload
    fs.unlinkSync(filePath);

    return {
      id: fileId,
      downloadLink,
      webViewLink,
    };
  } catch (error) {
    throw null;
  }
}

// Function to download a file by Drive ID and create a local copy
export async function createTemplateFromDrive(driveId: string, destinationPath: string): Promise<string> {
  try {
    const service = await googleJWTAuth();
    const drive = service?.drive;
    if (!drive) throw new Error('Google Drive client authentication failed');

    // Fetch file metadata to get the file name
    const fileMetadata = await drive.files.get({
      fileId: driveId,
      fields: 'name', // Only request the file name
    });

    const fileName = fileMetadata.data.name;
    const fullPath = `${destinationPath}/${fileName}`;

    // Download the file
    const response = await drive.files.get(
      {
        fileId: driveId,
        alt: 'media',
      },
      { responseType: 'stream' }
    );
    // Stream to a local file with the retrieved name
    const dest = fs.createWriteStream(fullPath);
    await new Promise<void>((resolve, reject) => {
      response.data
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        })
        .pipe(dest);
    });

    return fullPath;
  } catch (error: any) {
    return '';
  }
}
