import bcrypt from "bcrypt";
import { errorMessages, regex } from "./inputValidation";
import { Role } from "../../database/role/role";
import { Status } from "../../database/status/status";
import { Login } from "../../database/auth/login";

// Function to generate a hash from a password using bcrypt
export async function generateHash(
  password: string,
  saltRounds = 10
): Promise<string> {
  const hash = bcrypt.hash(password, saltRounds);

  return hash;
}

// Function to trim leading and trailing whitespace from all string values in an object
export function trimObjectValues(
  obj: Record<string, string>
): Record<string, string> {
  const trimmedObj: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    trimmedObj[key] = value.trim();
  }

  return trimmedObj;
}

function isValueEmpty(value: string): boolean {
  return value?.trim() === "";
}

function isValueExceedsMaxLength(value: string, maxLength: number): boolean {
  return value.length > maxLength;
}

function validateText(value: string, regex: RegExp): boolean {
  return regex.test(value);
}

function validateRequiredField(value: string): string | null {
  if (isValueEmpty(value)) {
    return errorMessages.required;
  }

  return null;
}

function validateMaxLength(value: string, maxLength: number): string | null {
  if (isValueExceedsMaxLength(value, maxLength)) {
    return errorMessages.maxCharacterlimit;
  }

  return null;
}

function validateTextPattern(value: string, pattern: RegExp, messageName: string): string | null {
  if (!validateText(value, pattern)) {
    return errorMessages[messageName];
  }

  return null;
}

interface ValidationRule {
  field: string;
  validators: ((value: string) => string | null)[];
}

const validationRules: ValidationRule[] = [
  {
    field: "firstName",
    validators: [
      validateRequiredField,
      (value) => validateMaxLength(value, 100),
      (value) => validateTextPattern(value, regex.text, "firstName"),
    ],
  },
  {
    field: "lastName",
    validators: [
      validateRequiredField,
      (value) => validateMaxLength(value, 100),
      (value) => validateTextPattern(value, regex.text, "lastName"),
    ],
  },
  {
    field: "email",
    validators: [
      validateRequiredField,
      (value) => validateMaxLength(value, 100),
      (value) => validateTextPattern(value, regex.email, "email"),
    ],
  },
  {
    field: "password",
    validators: [
      validateRequiredField,
    ],
  },
  {
    field: "subdomainName",
    validators: [
      validateRequiredField,
      (value) => validateTextPattern(value, regex.text, "subdomainName"),
    ],
  },
  // Add more validation rules for other fields
];

// Function to validate an object based on the defined validation rules
export function validateFields(obj: Record<string, string>): string {
  for (const rule of validationRules) {
    const value = obj[rule.field];
    if (value !== undefined) {
      for (const validator of rule.validators) {
        const error = validator(value);
        if (error) {
          return error;
        }
      }
    }
  }

  return "";
}

//  Function to generate a random string with specified length and character set constraints
export function generateRandomString(strLength: number = 8): string {
  const uppercaseLetters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters: string = "abcdefghijklmnopqrstuvwxyz";
  const digits: string = "0123456789";
  const specialCharacters: string = "!@#$%^&*";

  const charset: string =
    uppercaseLetters + lowercaseLetters + digits + specialCharacters;
  const charsetLen: number = charset.length;

  // Ensure minimum length of 8 characters
  const length: number = Math.max(strLength, 8);

  let randomStr: string = "";

  // Add at least one uppercase letter
  randomStr += uppercaseLetters.charAt(
    Math.floor(Math.random() * uppercaseLetters.length)
  );

  // Add at least one lowercase letter
  randomStr += lowercaseLetters.charAt(
    Math.floor(Math.random() * lowercaseLetters.length)
  );

  // Add at least one digit
  randomStr += digits.charAt(Math.floor(Math.random() * digits.length));

  // Add at least one special character
  randomStr += specialCharacters.charAt(
    Math.floor(Math.random() * specialCharacters.length)
  );

  // Generate remaining characters randomly
  for (let i = randomStr.length; i < length; i++) {
    randomStr += charset.charAt(Math.floor(Math.random() * charsetLen));
  }

  return randomStr;
}

// Function to obfuscate a string by encoding it to base64 and removing "=" characters
export function obfuscate(str: string): string {
  const obfuscatedString = Buffer.from(str).toString("base64");

  return obfuscatedString.replace(/=/g, "");
}

// Function to deobfuscate a string by adding "=" characters and decoding from base64
export function deobfuscate(str: string): string {
  const paddedStr = str.padEnd(str.length + (4 - str.length % 4) % 4, "=");

  return Buffer.from(paddedStr, "base64").toString("utf8");
}

// for generate randam string
export function generateRandomAlphaString(length: any) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

// for glob searching
interface WhereExpressionType {
  searchString: string;
  params: { searchText: string };
}
// Creates a where expression for a SQL query with case-insensitive matching.
export const createWhereExpression = (
  fieldName: string,
  search: string | number
): WhereExpressionType => {
  return {
    searchString: `${fieldName} ILIKE :searchText`,
    params: {
      searchText: `%${search}%`,
    },
  };
};

// get role by role-constraint
export async function getRoleIdByConstraint(roleConstraint: string) {
  try {
    const trimmedRole = roleConstraint.trim();
    const role = await Role.findOne({ where: { roleConstraint: trimmedRole } });

    return role?.id;
  } catch (error) {
    throw error;
  }
}

// get status by status-constraint
export async function getStatusIdByConstraint(statusConstraint: string) {
  try {
    const trimmedStatus = statusConstraint.trim();
    const status = await Status.findOne({ where: { statusConstraint: trimmedStatus } });

    return status?.id;
  } catch (error) {
    throw error;
  }
}

// for get user by id
export async function getLoginDetails(id: string) {
  return await Login.findOne({
    where: { id },
  });
}

// for geeting date
export function getCurrentDateFormatted(): string {
  const currentDate = new Date();
  // Get the month, day, and year components
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const year = currentDate.getFullYear();

  // Return the date in MM/DD/YYYY format
  return `${month}/${day}/${year}`;
}

// by timestamp
export function convertTimestampToDate(timestamp: any) {
  const numericTimestamp = typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
  const date = new Date(numericTimestamp);
  // Get the month, day, and year components
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  // Return the date in MM/DD/YYYY format
  return `${month}/${day}/${year}`;
}

export function convertDateFormat(dateString: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  // Split the input string into month, day, and year
  const [monthName, day, year] = dateString.split("_");

  // Find the corresponding month number (1-12)
  const month = months.indexOf(monthName) + 1;

  // Format day and month to ensure two digits
  const dayFormatted = day.padStart(2, "0");
  const monthFormatted = month.toString().padStart(2, "0");

  return `${monthFormatted}/${dayFormatted}/${year}`;
}



//  This function takes a date string, parses it, and returns the date in the format "Month Day, Year".
export function formatTimestampToDateString(dateString: string): string {
  const dateParts = dateString.split("/");

  const [month, day, year] = dateParts.map(Number);
  // Create a Date object using the parsed values
  const date = new Date(year, month - 1, day);
  // Format the date
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

export const trimUrl = (url: string): string => {
  // Remove the 'www.' prefix only
  let trimmedUrl = url.replace(/^www\./, "");

  // Remove the trailing slash, if it exists
  if (trimmedUrl.endsWith("/")) {
    trimmedUrl = trimmedUrl.slice(0, -1);
  }

  return trimmedUrl;
};

// Function to remove the file extension (e.g., .docx, .pdf)
export function removeFileExtension(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, "");
}

export function getFormattedDate(): string {
  const date = new Date();

  return date.toLocaleString("en-US", { month: "long" }) + `_${date.getDate()}_${date.getFullYear()}`;
}

export function getFormattedDatehms(): string {
  const date = new Date();
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${month}_${day}_${year}_${hours}_${minutes}_${seconds}`;
}
