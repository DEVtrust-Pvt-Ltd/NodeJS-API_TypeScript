import { Domain } from "../../../database/domain/domain";
import { SubDomains } from "../../../database/domain/subdomain";

// get domain by ids
export const getdomains = async (domainIds: readonly string[]): Promise<Domain[]> => {
  const domainMap: Map<string, Domain> = new Map();
  const _ids = domainIds.map((id) => `${id}`);
  (await Domain.findByIds(_ids)).map((domain) =>
    domainMap.set(domain.id, domain)
  );

  return _ids.map((inputId) => domainMap.get(inputId) || null) as Domain[];
};

// get sub-domain by ids
export const getSubdomains = async (domainIds: readonly string[]): Promise<SubDomains[]> => {
  const domainMap: Map<string, SubDomains> = new Map();
  const _ids = domainIds.map((id) => `${id}`);
  (await SubDomains.findByIds(_ids)).map((domain) =>
    domainMap.set(domain.id, domain)
  );

  return _ids.map((inputId) => domainMap.get(inputId) || null) as SubDomains[];
};
