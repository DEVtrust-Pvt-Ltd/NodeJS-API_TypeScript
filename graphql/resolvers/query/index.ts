import { loginResolver } from "./auth/auth";
import { deleteDocumentById } from "./document/delete";
import { getDocument, getGeneratedDoc, viewdocument } from "./document/document";
import { deleteDomainById, deleteDomainByIds, deleteSubDomainById } from "./domain/delete";
import { restoreDomain, getDomainById, getDomains, getDomainIds } from "./domain/domain";
import { downloadDucmentByDomainId, getDriveFolderLinkById, getSection33, shareDriveFolder } from "./domain/drive";
import { getSubdomains } from "./domain/subdomain";
import { fetchUsersRolesAndStatuses } from "./lookup/lookup";
import { getSettlementById } from "./settlements/settlement";
import { deleteTemplateById, getTemplateById, templates } from "./template/template";
import { changePassword, forgotPassword } from "./user/forgotPassword";
import { getUserById, userProfile, users } from "./user/users";
import { getDashboardstats} from "./dashboard/dashboard";
import { getAuditVersion} from "./domain/auditversion"

export const queryResolvers = {
    login: loginResolver,
    forgotPassword,
    changePassword,
    userProfile,
    users,
    getDomains,
    fetchUsersRolesAndStatuses,
    getSubdomains,
    getDomainById,
    deleteDomainById,
    deleteDomainByIds,
    getDocument,
    getGeneratedDoc,
    restoreDomain,
    getDomainIds,
    viewdocument,
    deleteSubDomainById,
    getDriveFolderLinkById,
    shareDriveFolder,
    downloadDucmentByDomainId,
    templates,
    deleteTemplateById,
    getTemplateById,
    getSettlementById,
    deleteDocumentById,
    getUserById,
    getDashboardstats,
    getAuditVersion,
    getSection33
}
