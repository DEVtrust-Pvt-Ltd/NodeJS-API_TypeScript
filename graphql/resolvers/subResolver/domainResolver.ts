import { Domain } from "../../../database/domain/domain";
import { SubDomains } from "../../../database/domain/subdomain";
import { dataLoaders } from "../dataloaders";

// for Domain
export const domainSubResolver = {
  subdomains: async (parent: Domain) => {
    if (parent.subdomains === null || parent.subdomains === undefined) return [];

    return await dataLoaders.subDomainLoader.loadMany(parent.subdomains);
  },

  attorney: async (parent: Domain) => {
    if (parent.attorney === null || parent.attorney === undefined) return "";

    return await dataLoaders.userLoader.clear(parent.attorney).load(parent.attorney);
  },

  freelancers: async (parent: Domain) => {
    if (parent.freelancers === null || parent.freelancers === undefined) return [];

    return await dataLoaders.userLoader.loadMany(parent.freelancers);
  },

  gmaildocument: async (parent: Domain) => {
    if (parent.gmaildocument === null || parent.gmaildocument === undefined) return "";
    return await dataLoaders.AttornayGenerateDocumentLoader.clear(parent.gmaildocument).load(parent.gmaildocument);
  },

  status: async (parent: Domain) => {
    if (parent.status === null || parent.status === undefined) return "";

    return await dataLoaders.statusLoader.clear(parent.status).load(parent.status);
  },
  attornayDashboardStatus: async (parent: Domain) => {
    if (parent.attornayDashboardStatus === null || parent.attornayDashboardStatus === undefined) return "";
    return await dataLoaders.getAttornayDashboardStatusLoader.clear(parent.attornayDashboardStatus).load(parent.attornayDashboardStatus);
  },
  litigations: async (parent: Domain) => {
    if (parent.litigations === null || parent.litigations === undefined) return [];
    return await dataLoaders.LitigationLoader.loadMany(parent.litigations);
  },


};

// for sub-domain
export const SubDomainSubResolver = {
  domainId: async (parent: SubDomains) => {
    if (parent.domainId === null || parent.domainId === undefined) return "";
    return await dataLoaders.domainLoader.clear(parent.domainId).load(parent.domainId);
  },
};
