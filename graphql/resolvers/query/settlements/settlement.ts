import { Settlements } from "../../../../database/settlements/settlement";

// get Settlement by id
export const getSettlementById = async (
  _: any,
  { domainId }: { domainId: string },
) => {
  const settlement = await Settlements.createQueryBuilder('settlement').where({ domain: domainId }).getOne();
  return settlement;
}
