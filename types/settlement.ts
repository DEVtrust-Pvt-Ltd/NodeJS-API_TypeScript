export interface SettlementInput {
  domain: string,
  executionDate: string,
  paymentTerms: string,
  globalCompliance: string,
  accessibilityAudit: string,
  conformanceLetter: string,
  exhibitCompliance: string,
  settlementAmount: string,
  status: string,
  accessibilityStatement: string,
  accessibilityTraining: string,
  accessibilityConsultantRetention: string,
  custom: string
  fullyRemediated: boolean
  safeHarbarProvision: boolean
  additionField: [JSON];
}
export interface UpdateSettlementInput {
  domain: string,
  executionDate: string,
  paymentTerms: string,
  globalCompliance: string,
  accessibilityAudit: string,
  conformanceLetter: string,
  exhibitCompliance: string,
  settlementAmount: string,
  status: string,
  accessibilityStatement: string,
  accessibilityTraining: string,
  accessibilityConsultantRetention: string,
  custom: string
  fullyRemediated: boolean
  safeHarbarProvision: boolean
  additionField: [JSON];
}


export interface UploadFileInput {
  domainId: string
  mimetype: string;
  path: string;
}
