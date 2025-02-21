import { AttornayGenerateDocument } from "../../../database/document/attornayGenerateDocument";

// get gamil draft by ids
export const getAttornayGenerateDocument = async (draftIds: readonly string[]): Promise<AttornayGenerateDocument[]> => {
  const gmailDraftMap: Map<string, AttornayGenerateDocument> = new Map();
  const _ids = draftIds.map((id) => `${id}`);
  (await AttornayGenerateDocument.findByIds(_ids)).map((draft) =>
    gmailDraftMap.set(draft.id, draft)
  );

  return _ids.map((inputId) => gmailDraftMap.get(inputId) || null) as AttornayGenerateDocument[];
};
