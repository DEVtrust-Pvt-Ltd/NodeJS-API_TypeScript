export const Template = `
type Template {
    id: String
    section: String,
    subject: String,
    title:  String,
    content: String,
}

type TemplateWithSection {
    Demand: [Template],
    GlobalSettlement: [Template],
    Affidavit: [Template],
    ClientInvoice: [Template],
    DigitalComplianceLabInvoice: [Template],
    ExhibitA: [Template]
    ExhibitB: [Template]

}
`;
