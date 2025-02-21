import { In } from "typeorm";
import { AttornayGenerateDocument } from "../../../../database/document/attornayGenerateDocument";
import { Domain } from "../../../../database/domain/domain";
import { Litigation } from "../../../../database/litigation/litigation";
import { downloadDriveDoc, generateDocumentDownloadUrl } from "../../../utility/google/doc/createDocument";
import { getDriveFolderLink } from "../../../utility/google/driveFolder/share";


// Retrieve a Google Drive folder link based on domain ID
export const getDriveFolderLinkById = async (
  _: any,
  { id }: { id: string }
): Promise<string> => {
  try {
    // Find the domain by ID
    const domain = await Domain.findOne({ where: { id } });

    if (!domain || !domain.driveFolderId) {
      throw new Error(`Domain with ID ${id} not found or does not have a drive folder ID.`);
    }
    // Get the Google Drive folder link
    const { link } = await getDriveFolderLink(domain.driveFolderId);
    return link;
  } catch (error) {
    throw new Error(`Failed to retrieve Google Drive folder link`);
  }
};


// share link
// share link
export const shareDriveFolder = async (
  _: any,
  { id }: { id: string }
) => {
  const domain = await Domain.findOne({ where: { id } });
  const folderId = domain?.scanReportDriveId!;

  const { link, name } = await getDriveFolderLink(folderId);

  // Return both link and name as an object
  return { link, name };
};



// Download doc
export const downloadDucmentByDomainId = async (
  _: any,
  { domainId, generatefileSection }: { domainId: string, generatefileSection: [String] }
) => {
  const demandDocs = await getDemandDocs(domainId, generatefileSection);
  const litigationDocs = await getLitigationDocs(domainId, generatefileSection);
  return { demandDocs, litigationDocs };
};


// get getDemandDocs Download link
export async function getDemandDocs(domainId: string, generatefileSection: [String]) {
  try {
    const demandDocs: string[] = [];
    const documents = await AttornayGenerateDocument.find({ where: { domainId, generatefileSection: In(generatefileSection) } });
    for (const document of documents) {
      const demandAndDoc = await downloadDriveDoc(document.driveFileId);
      demandDocs.push(demandAndDoc); // Store the URL in the array
    }
    return demandDocs;
  } catch (error) {
    throw error;
  }
}

// get getDemandDocs download link
export async function getLitigationDocs(domainId: string, section: [String]) {
  try {
    const litigationDocs: string[] = [];
    const litigations = await Litigation.find({ where: { domainId, section: In(section) } });
    for (const litigation of litigations) {
      const demandAndDoc = await generateDocumentDownloadUrl(litigation.fileDriveId);
      litigationDocs.push(demandAndDoc);
    }
    return litigationDocs;
  } catch (error) {
    throw error;
  }
}

// get section 33
export async function getSection33(
  _: any,
  { domainId }: { domainId: string },
): Promise<Record<string, Litigation[]>> {
  const sections = ["Section33", "Exhibit"];
  const section = await Litigation.find({ where: { domainId, section: In(sections) }});
  const groupedSection = section.reduce((acc, sec) => {
    if (!acc[sec.section]) {
      acc[sec.section] = [];
    }
    acc[sec.section].push(sec);
    return acc;
  }, {} as Record<string, Litigation[]>);

  return groupedSection;
}

export async function getFilesWithPrefixRemoved(
  _: any,
  { domainId }: { domainId: string }
) {
  try {
    // Fetch all Section 33 records for the given domainId
    const section33Files = await Litigation.find({ where: { domainId, section: "Section33" } });

    // Map the data to remove the prefix dynamically without saving
    const updatedFiles = section33Files.map((file) => {
      const prefixRegex = /^.*\.com-/; // Matches any prefix ending with ".com-"
      const updatedFileName = file.fileName.replace(prefixRegex, "");
      return {
        ...file,
        fileName: updatedFileName, // Replace fileName for the return value only
      };
    });

    // Return the updated files with the prefix removed
    return updatedFiles;
  } catch (error) {
    console.error("An error occurred while processing file names:", error);
    throw error;
  }
}
