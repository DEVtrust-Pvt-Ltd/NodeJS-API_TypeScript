import { signUpUser } from "./user/create";
import { createDomain } from "./domain/create";
import { createSubDomain } from "./domain/createsubdomain";
import { updateDomain } from "./domain/updateDomain";
import { updateDomainScore } from "./domain/updateDomainScore";
import { createUserJoureny, updateUserJoureny, newUserJourney } from "./domain/createUserJoureny";
import { uploadStampReceipt, uploadFileOnDrive, uploadUserJourney, updateUploadFileOnDrive } from "./uploadFile/upload";
import { generateFile } from "./uploadFile/generateFile";
import { updateProfile } from "./user/updateProfile";
import { deleteUser } from "./user/deleteUser";
import { updatePassword } from "./user/updatePassword";
import { createDraftDoc, createMultipleDocDraft } from "./draft/create";
import { createLitigation, generateAIUserJourney } from "./AI/create";
import { createTemplate } from "./template/create";
import { createSettlement } from "./settlements/create";
import { updateTemplate } from "./template/edit";
import { updateSettement } from "./settlements/edit";
import { uploadSettlement } from "./settlements/uploade";
import { updateSignUpUser } from "./user/edit";
import { deleteAuditVersion } from "./domain/auditversion";

export const mutationResolvers = {
    signUpUser,
    importDomains: createDomain,
    createSubDomain,
    updateDomain,
    updateDomainScore,
    uploadFileOnDrive,
    createUserJoureny,
    updateUserJoureny,
    newUserJourney,
    generateFile,
    updateProfile,
    deleteUser,
    updatePassword,
    uploadUserJourney,
    createDraftDoc,
    generateAIUserJourney,
    createLitigation,
    createTemplate,
    createMultipleDocDraft,
    createSettlement,
    updateTemplate,
    updateSettement,
    uploadSettlement,
    uploadStampReceipt,
    updateSignUpUser,
    updateUploadFileOnDrive,
    deleteAuditVersion
};
