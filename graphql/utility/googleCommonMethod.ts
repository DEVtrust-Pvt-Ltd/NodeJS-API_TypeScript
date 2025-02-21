import { google } from "googleapis";
import path from "path";
import yenv from "yenv";
const env = yenv("env.yaml", { env: "development" });
import fs from "fs";

// for auth
const keyPath: string = path.resolve(__dirname, "../../config/googleCredentials/TEST-ga-441407-522b8be4e326.json");
const keyFile = JSON.parse(fs.readFileSync(keyPath, "utf8"));

export const googleJWTAuth = async (userEmail: string = env.GOOGLE_EMAIL) => {
  try {
    const auth = new google.auth.JWT({
      email: keyFile.client_email,
      key: keyFile.private_key,
      scopes: [
        `${env.GOOGLE_API_BASE_URL}auth/drive`,
        `${env.GOOGLE_API_BASE_URL}auth/drive.file`,
        `${env.GOOGLE_API_BASE_URL}auth/documents`,
        `${env.GOOGLE_API_BASE_URL}auth/gmail.readonly`,
        `${env.GOOGLE_API_BASE_URL}auth/gmail.compose`,
        `${env.GOOGLE_API_BASE_URL}auth/admin.directory.user.readonly`,
      ],
      subject: userEmail
    });
    const drive = google.drive({ version: "v3", auth });
    const docs = google.docs({ version: "v1", auth });
    const gmail = google.gmail({ version: "v1", auth });
    const admin = google.admin({ version: "directory_v1", auth });

    return { drive, docs, gmail, admin };
  } catch (error) {
    return null;
  }
};

// for folder color
export const getFolderColorByScore = (score: number) => {
  if (score >= 0 && score <= 69) {
    return "#ff0000"; // Red
  } else if (score >= 70 && score <= 89) {
    return "#FFA500"; // Yellow
  } else if (score >= 90 && score <= 100) {
    return "#008000"; // Green
  } else {
    return "#808080"; // Grey
  }
};
