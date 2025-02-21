import { connections } from "./connection/connections";
import { edges } from "./edge/edges";
import { enums } from "./enums/enums";
import { inputTypes } from "./inputs";
import { root } from "./root";
import { User } from "./user";
import { Domain } from "./domain";
import { Document } from "./document";
import { Template } from "./template";
import { Settlement } from "./settlement";

export const typeDefs = [...inputTypes, connections, edges, enums, root, User, Domain, Document, Template, Settlement];
