import { Litigation } from "../../../database/litigation/litigation";

// get gamil litigation by ids
export const getLitigation = async (litigationIds: readonly string[]): Promise<Litigation[]> => {
  const litigationMap: Map<string, Litigation> = new Map();
  const _ids = litigationIds.map((id) => `${id}`);
  (await Litigation.findByIds(_ids)).map((litigation) =>
    litigationMap.set(litigation.id, litigation)
  );

  return _ids.map((inputId) => litigationMap.get(inputId) || null) as Litigation[];
};
