import { googleJWTAuth } from "../../googleCommonMethod";
import { htmlToText } from "html-to-text";
import yenv from "yenv";
const env = yenv("env.yaml", { env: "development" });
import * as fs from "fs";
// Create Document on drive
export const createDocument = async (title: string, folderId: string) => {
  try {
    const service: any = await googleJWTAuth();
    const drive = service.drive;
    const docs = service.docs;

    // Step 1: Search for existing files with the same title inside the specified folder
    const existingFiles = await drive.files.list({
      q: `name='${title}' and mimeType='application/vnd.google-apps.document' and '${folderId}' in parents`,
      fields: "files(id, name)",
    });

    // Step 2: If a document with the same title exists, delete it
    if (existingFiles.data.files.length > 0) {
      const fileId = existingFiles.data.files[0].id;
      await drive.files.delete({ fileId });
    }

    // Step 3: Create a new document in the specified folder
    const document = await docs.documents.create({
      requestBody: {
        title: title,
      },
    });

    // Step 4: Move the newly created document to the specified folder
    const fileId = document.data.documentId;
    await drive.files.update({
      fileId: fileId,
      addParents: folderId,
      removeParents: "root",
      fields: "id, parents",
    });

    return document.data.documentId;
  } catch (error) {
    return null;
  }
};

// Move Document to folder
export async function moveDocumentToFolder(documentId: string, folderId: string) {
  try {
    const service: any = await googleJWTAuth();
    const drive = service.drive;

    // Retrieve the current parents of the file
    const file = await drive.files.get({
      fileId: documentId,
      fields: "parents",
    });

    const previousParents = file.data.parents.join(",");

    // Move the file to the new folder
    const updatedFile = await drive.files.update({
      fileId: documentId,
      addParents: folderId,
      removeParents: previousParents,
      fields: "id, parents, webViewLink",
    });

    // Generate the export link for the file as a PDF
    const downloadLink = `${env.DRIVE_URL}/feeds/download/documents/export/Export?id=${documentId}&exportFormat=pdf`;

    // Return the download link along with other data
    return {
      ...updatedFile.data,
      downloadLink,
    };
  } catch (error) {
    return null;
  }
}

// update document
export async function updateGoogleDoc(documentId: string, text: string) {
  try {
    const service: any = await googleJWTAuth();
    const docs = service.docs;
    // Convert HTML to plain text
    const content = htmlToText(text);
    const requests = [
      {
        insertText: {
          location: { index: 1 },
          text: content
        },
      },
    ];
    const response = await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: requests,
      },
    });

    return response;
  } catch (error) {
    return null;
  }
}

// for the viewing document
export async function viewDoc(fileId: string): Promise<{ url: string, fileName: string }> {
  const service = await googleJWTAuth();
  const drive = service?.drive;
  if (!drive) throw new Error("Google Drive client authentication failed");

  // Generate the embed code for the document
  await drive.permissions.create({ fileId, requestBody: { type: "anyone", role: "reader" } });

  // Get the file's metadata to retrieve the file name
  const fileMetadata = await drive.files.get({ fileId, fields: "name", });
  const fileName = fileMetadata.data.name!;

  const url = `${env.DRIVE_URL}/file/d/${fileId}/preview`;

  // Return an object with both URL and file name
  return { url, fileName };
}

// download URL based on MIME type
export async function downloadDriveDoc(fileId: string): Promise<string> {
  const service = await googleJWTAuth();
  const drive = service?.drive;
  if (!drive) throw new Error("Google Drive client authentication failed");
  // Set permissions to allow anyone with the link to view/download the document
  await drive.permissions.create({
    fileId,
    requestBody: {
      type: "anyone",  // Anyone with the link
      role: "reader",  // Read-only access
    },
  });

  // Construct the download URL
  const downloadUrl = `${env.DRIVE_URL}/uc?id=${fileId}&export=download`;

  return downloadUrl;
}

// Generate download URL for Google Drive documents
export async function generateDocumentDownloadUrl(fileId: string): Promise<string> {
  const service = await googleJWTAuth();
  const drive = service?.drive;
  if (!drive) throw new Error("Google Drive client authentication failed");

  // Set permissions to allow anyone with the link to view/download the document
  await drive.permissions.create({
    fileId,
    requestBody: {
      type: "anyone",  // Anyone with the link
      role: "reader",  // Read-only access
    },
  });
  // Construct the download URL
  const downloadUrl = `${env.GOOGLE_DRIVE_DOC_URL}/document/d/${fileId}/export?format=doc`;

  return downloadUrl;
}

// For AI res
export async function updateGoogleDocLitigation(documentId: string, text: string) {
  try {
    const service: any = await googleJWTAuth();
    const docs = service.docs;

    // Extract the bold text segments from the input string
    const regex = /\*\*(.*?)\*\*/g;
    const boldTextArray: any[] = [];
    const textWithoutBold = text.replace(regex, (fullMatch, capturedText) => {
      boldTextArray.push(capturedText);

      return capturedText; // Return the text without asterisks
    });

    // Insert the plain text (without bold markers) into the document
    const insertTextRequest = {
      insertText: {
        location: { index: 1 }, // Adjust the index based on the document structure
        text: textWithoutBold,
      },
    };

    // Execute the insert text request
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [insertTextRequest],
      },
    });

    // Now, apply bold formatting to the extracted text
    let currentIndex = 0; // Start after index 1 (as text is inserted at index 1)
    const requests: {
      updateTextStyle: {
        range: {
          startIndex: number; // Adjust for the inserted text location
          endIndex: any;
        }; textStyle: { bold: boolean; }; fields: string;
      };
    }[] = [];

    boldTextArray.forEach((boldText) => {
      const startIndex = textWithoutBold.indexOf(boldText, currentIndex);
      const endIndex = startIndex + boldText.length;

      if (startIndex !== -1) {
        // Create a request to apply bold formatting
        requests.push({
          updateTextStyle: {
            range: {
              startIndex: startIndex + 1, // Adjust for the inserted text location
              endIndex: endIndex + 1,
            },
            textStyle: {
              bold: true, // Apply bold styling
            },
            fields: "bold", // Specify which text style field to update
          },
        });
        currentIndex = endIndex; // Update the current index for subsequent bold text
      }
    });
    // Execute the bold formatting requests
    if (requests.length > 0) {
      await docs.documents.batchUpdate({
        documentId,
        requestBody: {
          requests,
        },
      });
    }

    return { success: true };
  } catch (error) {
    return null;
  }
}

// Function to upload the image to Google Drive
export async function uploadImageToDrive(imagePath: string, driveFolderId: string) {
  const service: any = await googleJWTAuth();
  const drive = service.drive;
  const fileMetadata = {
    "name": "image.png",
    "parents": [driveFolderId] // replace with your drive folder ID if necessary
  };
  const media = {
    mimeType: "image/png",
    body: fs.createReadStream(imagePath)
  };
  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id"
  });

  return response.data.id;
}

export async function insertImageIntoGoogleDoc(docId: string, imageId: string) {
  const service: any = await googleJWTAuth();
  const docs = service.docs;
  const drive = service.drive;

  // Get the document's current content to find the last index
  const document = await docs.documents.get({
    documentId: docId,
  });

  // Find the last index in the document
  const endIndex =
    document.data.body.content[document.data.body.content.length - 1]
      .endIndex - 1;

  // Define the requests to insert the image, align it, and add text below
  const requests = [
    {
      insertInlineImage: {
        uri: `https://drive.google.com/uc?id=${imageId}`,
        location: {
          index: endIndex, // Insert at the end of the document
        },
        objectSize: {
          height: {
            magnitude: 100,
            unit: "PT",
          },
          width: {
            magnitude: 100,
            unit: "PT",
          },
        },
      },
    },
    // Align the image to the right using paragraph style
    {
      updateParagraphStyle: {
        range: {
          startIndex: endIndex,
          endIndex: endIndex + 1, // Adjust this if there are other elements after the image
        },
        paragraphStyle: {
          alignment: "END", // Align to the right
        },
        fields: "alignment",
      },
    },
    // Add a line break and text "TEST Paris" after the image
    {
      insertText: {
        location: {
          index: endIndex + 1, // Insert text just after the image
        },
        text: "\nTEST Paris", // Add a line break and the text "TEST Paris"
      },
    },
  ];

  // Execute the batchUpdate request
  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests,
    },
  });

  // Delete the temporary image file from Drive
  await drive.files.delete({
    fileId: imageId,
  });

  return { success: true };
}

