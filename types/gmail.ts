export interface DraftInput {
  domainId: string;
  generatefileSection: string;
  templateId: string
}

export interface MultipleDocDraftDraftInput {
  domainId: string;
  generatefileSection: [string];
  templateId: string
}
