
import { AttornayGenerateDocument } from "../../../../database/document/attornayGenerateDocument";
import { Document } from "../../../../database/document/doument";
import { viewDoc } from "../../../utility/google/doc/createDocument";

// get domain by id
export const getDocument = async (
  _: any,
  { id }: { id: string }
) => {
  const documents = await Document.createQueryBuilder()
    .where({ subDomain: id })
    .getMany();

  return documents;
};

// get domain by id
export const getGeneratedDoc = async (
  _: any,
  { domainId }: { domainId: string }
) => {
  const documents = await AttornayGenerateDocument.createQueryBuilder()
    .where({ domainId })
    .getMany();

  return documents;
};

// get domain by id
export const viewdocument = async (
  _: any,
  { fileId }: { fileId: string }
) => {
  const doc = await viewDoc(fileId);

  return doc.url;
};
