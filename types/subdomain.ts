export interface SubDomainInput {
  domainId: string;
  subDomainName: [string];
}

export interface UpdateDomain {
  id: string;
  category: string;
  companyName: string;
  domainName: string;
  email: string;
  streetAddress: string;
  streetAddress2: string,
  secondaryAddress: [JSON];
  city: string;
  state: string;
  zip: string;
  freelancers: [string];
  visiteDate: string;
  userJourney: string;
  attorney: string;
  status: string;
  score: string;
  ids: [string];
  demandDate: string;
  attornayDashboardStatus: string;
  secondaryEmails: [string];
  phone: string;
  response: string;
  note: string;
  emailSend: string;
}


export interface uploadFile {
  id: string;
  files: [fileInput];
  uploadfileSection: string;
  isSkip: boolean;
  documentId: string;
}

export interface updateUploadFile {
  id: string;
  subdomainId: string
  files: [fileInput];
  uploadfileSection: string;
  isSkip: boolean;
}

export interface fileInput {
  mimetype: string;
  path: string;

}

export interface UpdateUserJourneyInput {
  id: string
  userJourney: string
  isUserJourneyAI: boolean
}

export interface generateFileInput {
  domainId: string;
  demandDate: string;
  generatefileSection: [string];
}

export interface UploadUserJourneyInput {
  domainId: string
  mimetype: string;
  path: string;
  type: string;
}
export interface UserJourneyAIInput {
  domainId: string;
  date: string;
  section: string;
  fileId: string;
  soap: string;
}
export interface uploadStampReceiptInput {
  domainId: string
  mimetype: string;
  path: string;
}
