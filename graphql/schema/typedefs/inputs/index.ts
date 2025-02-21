import { CreateDomainInput, } from "./createDomainInput";
import { settlementInput } from "./settlement";
import { templateInput } from "./template";
import { UploadFileInput } from "./uploadFileInput";
import { userInput } from "./userInput";
export const inputTypes = [
    userInput,
    CreateDomainInput,
    UploadFileInput,
    templateInput,
    settlementInput
];
