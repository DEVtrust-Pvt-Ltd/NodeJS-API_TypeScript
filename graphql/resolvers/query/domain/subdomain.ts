import { Brackets } from "typeorm";
import { SubDomains } from "../../../../database/domain/subdomain";
import { createWhereExpression } from "../../../utility/commonMethod";
import { validSubDomainSearchFields } from "../../../../types/searchFields";
import { Document } from "../../../../database/document/doument";

// get sub-subdomain by domain id
export const getSubdomains = async (
  _: any,
  input: { domainId: string, search: string },
) => {
  const { search, domainId } = input;
  const subDomainQuery = await SubDomains.createQueryBuilder("subDomain").where({ domainId }).orderBy("subDomain.createdAt", "DESC");

  // for global serching
  if (search) {
    const brackets = new Brackets((sqb) => {
      validSubDomainSearchFields.map((field, idx) => {
        const { searchString, params } = createWhereExpression(field, search);
        sqb.orWhere(searchString, params);
      });
    });
    subDomainQuery.andWhere(brackets);
  }


  const [subdomains, totalCount] = await subDomainQuery.getManyAndCount();

  // Initialize allUploaded as false
  let allUploaded = false;

  // Process each subdomain to check for associated documents
  const subdomainNodes = await Promise.all(
    subdomains.map(async (subdomain) => {
      const documents = await Document.find({ where: { subDomain: subdomain.id } });
      // Check if there are more than 4 documents for the subdomain
      if (documents.length >= 4) {
        allUploaded = true;
      }
      return {
        node: {
          ...subdomain,
          allUploaded,
        },
        cursor: subdomain.id,
        allUploaded,
      };
    })
  );

  return {
    totalCount,
    edges: subdomainNodes,
  };
};
