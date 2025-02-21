
// Helper function to determine greeting based on the current time
export function getGreeting(): string {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Good morning";
  if (currentHour < 18) return "Good afternoon";

  return "Good evening";
}

// Helper function to replace placeholders in the email content
// Helper function to replace placeholders in the email content and subject
export function generateEmailContent(templateContent: string, templateSubject: string, domain: any, greeting: string): { content: string; subject: string } {
  const emailContent = `
    <p>${greeting},</p>
    ${templateContent
      .replace(/{{CompanyName}}/g, domain.companyName)
      .replace(/{{domainName}}/g, domain.domainName)
      .replace(/{{Domain}}/g, domain.domainName)}
  `;

  const emailSubject = templateSubject.replace(/{{CompanyName}}/g, domain.companyName);

  return { content: emailContent, subject: emailSubject };
}

// Helper function to send the draft to Gmail
export async function sendDraft(gmail: any, userEmail: string, rawMessage: string): Promise<any> {
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
  } catch (error: any) {
    return null;
  }
}
