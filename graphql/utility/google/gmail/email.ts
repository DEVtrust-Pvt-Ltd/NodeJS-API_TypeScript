import { googleJWTAuth } from "../../googleCommonMethod";
import path from "path";
import nodemailer from "nodemailer";
import { gmail_v1 } from "googleapis";
import { Domain } from "../../../../database/domain/domain";
import { Template } from "../../../../database/template/template";
import { generateEmailContent, getGreeting, sendDraft } from "../../templatesMethod";

// Function to create a draft email
export async function createDraft(
  userEmail: string,
  path: string,
  filename: string,
  domainId: string,
  templateId: string
): Promise<any> {
  try {
    // Fetch domain and template data concurrently
    const [domain, template] = await Promise.all([
      Domain.findOne({ where: { id: domainId } }),
      Template.findOne({ where: { id: templateId } })
    ]);

    if (!domain || !template) {
      throw new Error("Domain or Template not found");
    }

    const service: any = await googleJWTAuth(userEmail);
    const gmail = service.gmail;

    const greeting = getGreeting();
    const { content: emailContent, subject: emailSubject } = generateEmailContent(template.content, template.subject, domain, greeting);

    const mailOptions = {
      from: userEmail,
      subject: emailSubject,
      html: emailContent,
      attachments: [
        {
          filename,
          path
        }
      ],
    };
    const rawMessage = await createRawMessage(mailOptions);

    return await sendDraft(gmail, userEmail, rawMessage);
  } catch (error) {
    return "This user is not in your workspace";
  }
}

export async function createDraftMultipleDocDraft(
  userEmail: string,
  attachments: any[],
  domainId: string,
  templateId: string
): Promise<any> {
  try {
    // Fetch domain and template data concurrently
    const [domain, template] = await Promise.all([
      Domain.findOne({ where: { id: domainId } }),
      Template.findOne({ where: { id: templateId } })
    ]);

    if (!domain || !template) {
      throw new Error("Domain or Template not found");
    }

    const service: any = await googleJWTAuth(userEmail);
    const gmail = service.gmail;

    const greeting = getGreeting();
    const { content: emailContent, subject: emailSubject } = generateEmailContent(template.content, template.subject, domain, greeting);

    const mailOptions = {
      from: userEmail,
      subject: emailSubject,
      html: emailContent,
      attachments: attachments

    };
    const rawMessage = await createRawMessage(mailOptions);

    return await sendDraft(gmail, userEmail, rawMessage);
  } catch (error) {
    console.log("error", error);

    return "This user is not in your workspace";
  }
}
// Function to update a draft email with new content
export async function updateDraft(userEmail: string, draftId: string) {
  const service: any = await googleJWTAuth(userEmail);
  const gmail = service.gmail;

  const attachments = [
    {
      filename: "update.png",
      path: path.join(__dirname, "image.png") // Path to your updated file
    }
  ];

  // Create the updated email content
  const updatedMailOptions = {
    from: userEmail,
    // to: 'recipient@example.com', // will use if Required
    subject: "Updated Draft with Attachment",
    text: "This is the updated content of the draft email with an attachment created using the Gmail API.",
    attachments,
  };
  // Create a raw message
  const updatedRawMessage = await createRawMessage(updatedMailOptions);
  try {
    const res = await gmail.users.drafts.update({
      userId: userEmail,
      id: draftId,
      requestBody: {
        message: {
          raw: updatedRawMessage
        }
      }
    });

    return res.data;
  } catch (err: any) {
    console.error(`Error updating draft for ${userEmail}:`, err.message);
  }
}

// Monitor the Thread for Replies
export async function checkThreadForReplies(threadId: string, userEmail: string) {
  try {
    const service: any = await googleJWTAuth(userEmail);
    const gmail = service.gmail;

    const res = await gmail.users.threads.get({
      userId: userEmail,
      id: threadId
    });

    const messages: Array<gmail_v1.Schema$Message> = res.data.messages || [];

    // Filter messages: only keep those sent by the original sender or replies to that email,and exclude auto-replies
    const filteredMessages = messages.filter((message) => {
      const headers = message.payload?.headers || [];
      // const fromHeader = headers.find(header => header.name === 'From')?.value || '';
      const inReplyToHeader = headers.find(header => header.name === "In-Reply-To")?.value || "";
      const subjectHeader = headers.find(header => header.name === "Subject")?.value || "";
      const autoSubmittedHeader = headers.find(header => header.name === "Auto-Submitted")?.value || "";
      const precedenceHeader = headers.find(header => header.name === "Precedence")?.value || "";
      const autoResponseSuppressHeader = headers.find(header => header.name === "X-Auto-Response-Suppress")?.value || "";

      // Check if the message is an auto-reply
      const isAutoReply = autoSubmittedHeader === "auto-replied" ||
        precedenceHeader === "bulk" ||
        precedenceHeader === "list" ||
        autoResponseSuppressHeader.includes("OOF") || // Out of office
        subjectHeader.toLowerCase().includes("out of office") ||
        subjectHeader.toLowerCase().includes("autoreply") ||
        subjectHeader.toLowerCase().includes("auto reply");

      // Filter out auto-replies and keep only relevant messages

      // return (fromHeader.includes(sentEmailAddress) || inReplyToHeader) && !isAutoReply;
      return inReplyToHeader && !isAutoReply;
    });

    return filteredMessages[0].internalDate;
  } catch (error: any) {
    return null;
  }
}

// Monitor the Thread for Sent
export async function checkThreadForSent(threadId: string, userEmail: string) {
  const service: any = await googleJWTAuth(userEmail);
  const gmail = service.gmail;

  try {
    const res = await gmail.users.threads.get({
      userId: userEmail,
      id: threadId,
    });
    const messages: gmail_v1.Schema$Message[] = res.data.messages || [];
    for (const message of messages) {
      const labelIds = message.labelIds || [];
      if (labelIds.includes("SENT")) {
        return message.internalDate; // Return as soon as we find a sent message
      }
    }

    return []; // Return blank if no sent messages are found
  } catch (err) {
    return null;
  }
}

// get list from Labels
export const listLabels = async () => {
  try {
    const service: any = await googleJWTAuth();
    const gmail = service.gmail;
    const res = await gmail.users.labels.list({
      userId: "me",
    });

    return res.data;
  } catch (err) {
    console.error("The API returned an error: " + err);
  }
};

// Function to list all users in the domain
export async function listUsers() {
  try {
    const service: any = await googleJWTAuth();
    const admin = service.admin;
    const res = await admin.users.list({
      customer: "my_customer", // Use 'my_customer' to list all users in the domain
      maxResults: 500, // Adjust the max results as needed
      orderBy: "email"
    });

    return res.data.users || [];
  } catch (err: any) {
    console.error("Error listing users:", err.message);
    throw err;
  }
}

// Function to create a raw email message with an attachment
export async function createRawMessage(mailOptions: any) {
  const transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true
  });
  const message = await transporter.sendMail(mailOptions);
  const mail = message.message.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  return mail;
}

// Function to delete a Gmail draft by id
export async function deleteDraft(userEmail: string, draftId: string) {
  try {
    const service: any = await googleJWTAuth(userEmail);
    const gmail = service.gmail;

    // Delete the draft
    const res = await gmail.users.drafts.delete({
      userId: userEmail,
      id: draftId,
    });

    return res;
  } catch (err: any) {
    return null;
  }
}

// Function to check if a user exists in Google Workspace
export async function isUserInGoogleWorkspace(userEmail: string): Promise<boolean> {
  try {
    // Authenticate and get the admin service
    const service = await googleJWTAuth();
    if (!service || !service.admin) {
      throw new Error("Failed to authenticate with Google Admin SDK");
    }

    const admin = service.admin;

    // Retrieve the user from Google Workspace using Admin SDK
    const user = await admin.users.get({
      userKey: userEmail, // Use userEmail to query
    });

    // If the user exists, return true
    return !!user.data.id;
  } catch (error: any) {
    throw new Error(`This user is not in your workspace`);
  }
}
