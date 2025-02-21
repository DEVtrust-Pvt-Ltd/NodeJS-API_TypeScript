import { googleJWTAuth } from "../../googleCommonMethod";

// for sharing drive
export async function shareFile(folderId: string, emails: string[], userEmail: string): Promise<string[]> {
  const service: any = await googleJWTAuth();
  const drive = service.drive;
  const permissionIds: string[] = [];
  // Iterate over emails and assign view permissions
  for (const email of emails) {
    const permission = {
      type: "user",
      role: "reader",
      emailAddress: email,
    };
    const result = await drive.permissions.create({
      resource: permission,
      fileId: folderId,
      fields: "id",
    });
    permissionIds.push(result.data.id);
  }
  // Generate a shareable link
  const linkResult = await drive.files.get({
    fileId: folderId,
    fields: "webViewLink"
  });
  const link = linkResult.data.webViewLink;
  await createDraft(userEmail, link);
  return permissionIds;
}



// Create a draft email with a clickable link
export async function createDraft(userEmail: string, path: string): Promise<any> {
  const service: any = await googleJWTAuth(userEmail);
  const gmail = service.gmail;

  // Construct the clickable link
  const link = `<a href="${path}" target="_blank" rel="noopener noreferrer">Click Here</a>`;
  // Create the raw message with HTML content
  const rawMessage = createRawMessage(
    "Here is your shared file",
    `Hello,<br><br>Please find the shared file here: ${link}.<br><br>Best regards,<br>Your Team`
  );

  // Create a draft message
  try {
    const res = await gmail.users.drafts.create({
      userId: userEmail,
      requestBody: {
        message: {
          raw: rawMessage
        }
      }
    });
    return res.data;
  } catch (err: any) {
    return "This user is not in your workspace.";
  }
}

// Utility function to encode a string in Base64 URL format
function encodeBase64Url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Function to create a raw email message with HTML content
function createRawMessage(subject: string, body: string): string {
  const messageParts = [
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=\"UTF-8\"",
    "",
    body,
  ];
  return encodeBase64Url(messageParts.join("\n"));
}


// // get folder link by google folder-Id
export async function getDriveFolderLink(folderId: string): Promise<{ link: string, name: string }> {
  try {
    // Authenticate and get Google Drive service
    const service: any = await googleJWTAuth();
    const drive = service.drive;

    // Set the folder's permissions to allow public read access
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: "reader", // Set to 'reader' for read-only access
        type: "anyone", // This allows anyone with the link to view
      },
    });

    // Fetch the shareable link for the folder
    const { data } = await drive.files.get({
      fileId: folderId,
      fields: "webViewLink, name"
    });
    return {
      link: data.webViewLink,
      name: data.name
    };
  } catch (error) {
    return { link: "", name: "" };
  }
}
