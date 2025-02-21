import { queryResolvers } from "./resolvers/query";
import { mutationResolvers } from "./mutations";
import { userSubResolver } from "./resolvers/subResolver/userSubResolver";
import { domainSubResolver, SubDomainSubResolver } from "./resolvers/subResolver/domainResolver";
export const resolvers = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
    User: userSubResolver,
    DomainResponse: domainSubResolver,
    SubdomainResponse: SubDomainSubResolver
};
