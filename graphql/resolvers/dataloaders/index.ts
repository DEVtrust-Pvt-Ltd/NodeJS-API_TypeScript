import DataLoader from "dataloader";
import { Login } from "../../../database/auth/login";
import { getUsers, roleById } from "./userLoader";
import { Role } from "../../../database/role/role";
import { Domain } from "../../../database/domain/domain";
import { getdomains, getSubdomains } from "./domainLoader";
import { SubDomains } from "../../../database/domain/subdomain";
import { Status } from "../../../database/status/status";
import { getAttornayDashboardStatus, getStatus } from "./statusLoader";
import { getAttornayGenerateDocument } from "./draftLoader";
import { AttornayGenerateDocument } from "../../../database/document/attornayGenerateDocument";
import { AttornayDashboardStatus } from "../../../database/status/attornayDashboardStatus";
import { Litigation } from "../../../database/litigation/litigation";
import { getLitigation } from "./litigationLoader";
const cacheProp = { cache: true };
export const dataLoaders = {
  userLoader: new DataLoader<string, Login>(getUsers, cacheProp),
  roleLoader: new DataLoader<string, Role>(roleById, cacheProp),
  domainLoader: new DataLoader<string, Domain>(getdomains, cacheProp),
  subDomainLoader: new DataLoader<string, SubDomains>(getSubdomains, cacheProp),
  statusLoader: new DataLoader<string, Status>(getStatus, cacheProp),
  getAttornayDashboardStatusLoader: new DataLoader<string, AttornayDashboardStatus>(getAttornayDashboardStatus, cacheProp),
  AttornayGenerateDocumentLoader: new DataLoader<string, AttornayGenerateDocument>(getAttornayGenerateDocument, cacheProp),
  LitigationLoader: new DataLoader<string, Litigation>(getLitigation, cacheProp),
};
