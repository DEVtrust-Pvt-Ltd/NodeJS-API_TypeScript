import { Brackets, In } from "typeorm";
import { Domain } from "../../../../database/domain/domain";
import { SubDomains } from "../../../../database/domain/subdomain";
import { createWhereExpression, convertTimestampToDate, getLoginDetails, getCurrentDateFormatted } from "../../../utility/commonMethod";
import { validDomainSearchFields } from "../../../../types/searchFields";
import { dataLoaders } from "../../dataloaders";
import { GraphQLContext } from "../../../utility/graphql";
import { Role } from "../../../../database/role/role";
import { Login } from "../../../../database/auth/login";
import { checkThreadForReplies, checkThreadForSent } from "../../../utility/google/gmail/email";
import { AttornayGenerateDocument } from "../../../../database/document/attornayGenerateDocument";
import { Litigation } from "../../../../database/litigation/litigation";
import { Document } from "../../../../database/document/doument";
import { Status } from "../../../../database/status/status";
import { getDriveFolderLink } from "../../../utility/google/driveFolder/share";
import { AttornayDashboardStatus } from "../../../../database/status/attornayDashboardStatus";
import { AuditVersion } from "../../../../database/document/auditVersion";


// Function to get status counts
export const getStatusCounts = async (userId: string) => {
  const roleId = (await Login.findOne({ where: { id: userId } }))?.roleId;
  const role = (await Role.findOne({ where: { id: roleId } }))?.roleConstraint;
  const statusConstraints = [
    "Unsent",
    "Sent",
    "Responded",
    "Litigation",
    "Settled",
    "No_go",
  ];

  // Initialize an object to store counts
  const statusCounts: { [key: string]: number } = {};
  for (const statusConstraint of statusConstraints) {
    // Fetch the status ID for the current constraint
    const statusId = (await AttornayDashboardStatus.findOne({ where: { statusConstraint } }))?.id;


    // If status ID is found, query the domain count for that status
    if (statusId) {
      const domainQuery = Domain.createQueryBuilder("domain")
        .where("domain.attornayDashboardStatus = :statusId", { statusId })
        .andWhere("domain.isActive = :isActive", { isActive: true });

      // Apply role-specific conditions
      if (role === "ATTORNEY") {
        domainQuery.andWhere("domain.attorney = :userId", { userId });
      } else if (role === "FREELANCER") {
        domainQuery.andWhere("domain.driveFolderId IS NOT NULL");
      }

      const domainCount = await domainQuery.getCount();
      statusCounts[statusConstraint] = domainCount;
    }
  }

  // Convert the statusCounts object to an array of { status, count }
  const statusCountsArray = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  return statusCountsArray;
};

// fetch scan audit docs uploaded or not
export async function fetchAndGroupAuditVersions(
  domainId: string
): Promise<Record<string, AuditVersion[]>> {
  const auditTypes = ["Video", "Audit", "Journey"];
  // Fetch the AuditVersion records for the given domain ID and audit types
  const sectionRecords = await AuditVersion.find({
    where: {
      domainId,
      auditType: In(auditTypes),
    },
  });

  // Group the records by their `auditType` property
  const groupedSections = sectionRecords.reduce((acc, sec) => {
    if (!acc[sec.auditType]) {
      acc[sec.auditType] = [];
    }
    acc[sec.auditType].push(sec);
    return acc;
  }, {} as Record<string, AuditVersion[]>);

  return groupedSections;
}

// get all domains
export const getDomains = async (
  _: any,
  input: { first: number, after: number, search: string, isActive: boolean },
  { userId }: GraphQLContext
) => {
  let { first = 10, after, search, isActive } = input;
  search = search === "" ? "Unsent" : search;

  // Fetch the user's role
  const roleId = (await Login.findOne({ where: { id: userId } }))?.roleId;
  const role = (await Role.findOne({ where: { id: roleId } }))?.roleConstraint;
  const statusId = (await Status.findOne({ where: { statusConstraint: "READY" } }))?.id;

  // Create the base query for domains
  const domainQuery = Domain.createQueryBuilder("domain")
    .innerJoin(
      AttornayDashboardStatus,
      "dashboardStatus",
      "dashboardStatus.id = domain.attornayDashboardStatus"
    )
    .where({ isActive })
    .orderBy("domain.domainNo", "ASC");

  // If the user has ATTORNEY permission, filter by attorney field
  if (role === "ATTORNEY") {
    domainQuery.andWhere("(domain.attorney = :userId)", { userId, });
  }
  // If the user has FREELANCER permission,
  if (role === "FREELANCER") {
    domainQuery.andWhere("domain.driveFolderId IS NOT NULL");

  }

  // Implement global search
  if (search) {
    const brackets = new Brackets((qb) => {
      validDomainSearchFields.forEach((field) => {
        const { searchString, params } = createWhereExpression(field, search);
        qb.orWhere(searchString, params);
      });
    });
    domainQuery.andWhere(brackets);
  }

  // Paginate results
  const [domains, totalCount] = await domainQuery.skip(after).take(first).getManyAndCount();

  // If no domains found, return empty results
  if (domains.length === 0) {
    return {
      totalCount: 0,
      getStatusCounts: await getStatusCounts(userId),
      edges: [],
    };
  }

  // Fetch subdomains for the retrieved domains
  const domainIds = domains.map((domain) => domain.id);
  const subdomains = await SubDomains.createQueryBuilder("subdomain")
    .where("subdomain.domainId IN (:...domainIds)", { domainIds })
    .getMany();

  // Map subdomains to their respective domains
  const domainMap = await Promise.all(domains.map(async (domain) => {
    const subdomainList = subdomains.filter(sub => sub.domainId === domain.id);
    const subdomainIds = subdomainList.map(sub => sub.id);
    const subDomainCount = subdomainIds.length;
    const scanAuditDoc = await fetchAndGroupAuditVersions(domain.id);


    // Fetch document count for the current domain's subdomains
    const documentCount = await Document.count({
      where: { subDomain: In(subdomainIds) },
    });

    if (documentCount && subDomainCount) {
      // Update domain status only if the condition is met
      if (documentCount === subDomainCount * 4 && scanAuditDoc.Journey.length > 0 && scanAuditDoc.Video.length > 0 && scanAuditDoc.Audit.length > 0) {

        // Fetch the current domain from the database
        const existingDomain = await Domain.findOne({ where: { id: domain.id } });

        // Ensure existingDomain is not null
        if (!existingDomain) {
          throw new Error(`Domain with id ${domain.id} not found`);
        }

        // Proceed with update only if the current status is different from statusId
        if (existingDomain.status !== statusId) {
          const response = await Domain.createQueryBuilder()
            .update(Domain)
            .set({ status: statusId })
            .where({ id: domain.id })
            .returning("*")
            .execute();

          if (!Array.isArray(response.raw) || response.raw.length === 0) {
            throw new Error("Failed to update settlement data");
          }

          // Reload domain to get updated status
          domain = await Domain.findOneOrFail({ where: { id: domain.id } });
        }
      }
    }
    return {
      node: {
        ...domain,
        subdomains: subdomainIds,
      },
      cursor: domain.id,
    };
  }));

  return {
    totalCount,
    getStatusCounts: await getStatusCounts(userId),
    edges: domainMap,
  };
};

// restoreDomain by ids
export const restoreDomain = async (
  _: any,
  { ids }: { ids: string[] },
): Promise<string> => {
  try {
    await Domain.update({ id: In(ids) }, { isActive: true, score: '' });
    return "Domain restored successfully";
  } catch (error) {
    throw new Error("Failed to restore domains");
  }
}

// Load domain and subdomains
const loadDomainAndSubdomains = async (id: string) => {
  const domain = await dataLoaders.domainLoader.clear(id).load(id);
  const subdomains = await SubDomains.createQueryBuilder("subdomain").where({ domainId: id }).getMany();
  const subdomainIds = subdomains.map(sub => sub.id);
  return { domain, subdomainIds };
};

// Fetch Gmail document
const fetchGmailDocument = async (id: string) => {
  return await AttornayGenerateDocument.createQueryBuilder().where({ domainId: id }).andWhere({ generatefileSection: "Demand" }).getOne();
};

// Get and update email dates
const getAndUpdateEmailDates = async (threadId: string, userEmail: string, domainId: string
) => {
  if (!threadId || !userEmail) return;
  const replyDate = await checkThreadForReplies(threadId, userEmail);
  const sendEmailDate = await checkThreadForSent(threadId, userEmail);
  if (sendEmailDate) {
    const emailSend = convertTimestampToDate(sendEmailDate);
    const today = getCurrentDateFormatted();
    let certified = '';
    if (today > emailSend) {
      certified = "Need to send";
    }
    await AttornayGenerateDocument.update({ domainId }, { emailSend, certified });
  }

  if (replyDate) {
    const response = convertTimestampToDate(replyDate);
    await AttornayGenerateDocument.update({ domainId }, { response });
  }
};

// for fomatting
function formatUserJourney(userJourney: string) {
  let formatted = userJourney
    .replace(/\n\n/g, "\n<br>\n")
    .replace(/\n•/g, "\n-")
    .replace(/\n\s+/g, "\n")
  formatted = formatted.replace(/(\*\*([^*]+)\*\*)/g, "<b>$2</b>");
  return formatted;
}
// get domain by id
export const getDomainById = async (
  _: any,
  { id }: { id: string },
  { userId }: GraphQLContext
) => {
  const { domain, subdomainIds } = await loadDomainAndSubdomains(id);
  // Default value is false
  let demandDocUploaded = false;
  let isUserJourneyAI = false;
  const litigations = await Litigation.find({ where: { domainId: id } });
  const litigationIds = litigations.map(litigation => litigation.id);

  const userJourney = await Litigation.findOne({ where: { domainId: id, section: "UserJourney" } });
  const demandDocLength = await AttornayGenerateDocument.find({ where: { domainId: id } });

  if (userJourney) {
    isUserJourneyAI = true;
    domain.userJourney = formatUserJourney(userJourney.aiGeneratedContent);
  }

  if (demandDocLength.length == 7) demandDocUploaded = true;

  const gmaildocument = await fetchGmailDocument(id);
  if (gmaildocument) {
    const login = await getLoginDetails(userId);
    const threadId = gmaildocument.threadId!;
    const userEmail = login?.email!;
    await getAndUpdateEmailDates(threadId, userEmail, id);
  }
  const litigationFolderLink = await getLitigationDriveLink(id)
  return {
    ...domain,
    isUserJourneyAI,
    subdomains: subdomainIds,
    gmaildocument: gmaildocument?.id,
    litigations: litigationIds,
    litigationFolderLink,
    demandDocUploaded
  };
};

// Get domain ids where isActive is true and score is null or empty
export const getDomainIds = async () => {
  const domains = await Domain.createQueryBuilder("domain")
    .select("domain.id")
    .where("domain.score IS NULL OR domain.score = ''")
    .andWhere({ isActive: true })
    .getMany();
  // Extract the IDs from the domains array
  const ids = domains.map(domain => domain.id);
  return ids;
};

// for litigation folder link
export async function getLitigationDriveLink(domainId: string): Promise<string | null> {
  const litigation = await Litigation.findOne({ where: { domainId, section: "Section33" } });

  if (!litigation || !litigation.parentDriveId) {
    return null;
  }

  const { link } = await getDriveFolderLink(litigation.parentDriveId);
  return link;
}
