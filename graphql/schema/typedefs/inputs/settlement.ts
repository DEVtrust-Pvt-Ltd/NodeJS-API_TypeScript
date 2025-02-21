export const settlementInput = `
input settlementInput {
    domain:String,
    executionDate : String,
    paymentTerms : String,
    globalCompliance : String,
    accessibilityAudit: String,
    conformanceLetter: String,
    exhibitCompliance: String,
    settlementAmount: String,
    status: String,
    accessibilityStatement: String,
    accessibilityTraining: String,
    accessibilityConsultantRetention: String,
    custom:String,
    fullyRemediated:Boolean,
    safeHarbarProvision:Boolean,
    additionField:[JSON],
}

input updateSettlementInput {
    domain:String,
    executionDate : String,
    paymentTerms : String,
    globalCompliance : String,
    accessibilityAudit: String,
    conformanceLetter: String,
    exhibitCompliance: String,
    settlementAmount: String,
    status: String,
    accessibilityStatement: String,
    accessibilityTraining: String,
    accessibilityConsultantRetention: String,
    custom:String,
    fullyRemediated:Boolean,
    safeHarbarProvision:Boolean
    additionField:[JSON],
}

input uploadFileInput {
    domainId: String,
    mimetype: String,
    path: String,
  }
`;
