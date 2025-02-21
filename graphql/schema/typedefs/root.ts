export const root = `
  # Query Definitions
  type Query {
    login(email: String!, password: String!): UserWithToken
    forgotPassword(email: String!):String
    changePassword(newPassword: String!,resetToken: String!):String
    userProfile : User
    users(search:String,first: Int, after: Int): UserConnection
    getDomains(search:String,first: Int, after: Int,isActive:Boolean):DomainConnection
    fetchUsersRolesAndStatuses:UsersRolesAndStatuses,
    getSubdomains(search:String,domainId:String):SubDomainConnection
    getDomainById(id:String):DomainResponse
    deleteDomainById(id:String):String
    deleteDomainByIds(ids:[String]):String
    getDocument(id:String):[DocumentResponse]
    getGeneratedDoc(domainId:String):[GenerateFileResponse]
    restoreDomain(ids:[String]):String
    getDomainIds:[String]
    viewdocument(fileId:String):String
    deleteSubDomainById(subDomainId:String):String
    getDriveFolderLinkById(id:String):String
    shareDriveFolder(id:String):driveFolder
    downloadDucmentByDomainId(domainId:String,generatefileSection:[String]):DocumentLink
    templates:TemplateWithSection
    deleteTemplateById(ids:[String]):String
    getTemplateById(id:String):Template
    getSettlementById(domainId:String):Settlement
    deleteDocumentById(id:String):String
    getUserById(id:String):User
    getDashboardstats: DashboardStats!
    getAuditVersion(did: String!): AuditVersionResponse!
    getSection33(domainId:String):Section33
    }

  # Mutation Definitions
  type Mutation {
    signUpUser(input: CreateUserInput!): UserWithToken
    updateSignUpUser(input: UpdateUserInput!): String
    importDomains(input : [CreateDomainInput]): [DomainResponse]
    createSubDomain(input : CreateSubDomainInput!): [SubdomainResponse]
    updateDomain(input:UpdateDomainInput):String
    updateDomainScore(ids:[String]) : String
    createUserJoureny(input:UserJourneyInput):String
    newUserJourney(id:String) : String
    uploadFileOnDrive(input:UploadFileInput):String
    updateUserJoureny(input:UserJourneyInput):String
    generateFile(input:GenerateFileInput):String
    updateProfile(input : UpdateProfileInput!): User
    deleteUser(input : DeleteUserInput!): DeleteUserResponse
    updatePassword(input: UpdatePasswordInput): String
    uploadUserJourney(input: UploadUserJourneyInput): String
    createDraftDoc(input: DraftInput): String
    generateAIUserJourney(input: UserJourneyAIInput):String
    createLitigation(input: UserJourneyAIInput):String
    createTemplate(input: templateInput):Template
    createMultipleDocDraft(input: createMultipleDocDraft):String
    createSettlement(input:settlementInput):Settlement
    updateTemplate(input: updateTemplateInput):Template
    updateSettement(input:updateSettlementInput):Settlement
    uploadSettlement(input:uploadFileInput):String
    uploadStampReceipt(input:UploadStampReceiptInput):String
    updateUploadFileOnDrive(input:UpdateUploadFileInput):String
    deleteAuditVersion(auditfileId: String!): String
  }

  # Scalar Definitions
  scalar DateTime
  scalar JSON
  scalar Upload
`;
