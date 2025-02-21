export const Settlement = `
    type Settlement {
    id:String
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
    fileDriveId:String,
    fileLink:String,
    fullyRemediated:Boolean,
    safeHarbarProvision:Boolean,
    additionField:[JSON],
    },
`;
