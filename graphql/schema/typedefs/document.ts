export const Document = `
    type DocumentResponse {
        id:String,
        createdBy:String,
        subDomain:String,
        fileLink:String,
        driveFileId:String,
        isSkip:Boolean,
        uploadfileSection:String,
        createdAt: DateTime,
        UpdatedAt: DateTime,
    },
      type GenerateFileResponse {
        id:String,
        createdBy:String,
        domainId:String,
        fileLink:String,
        generatefileSection:String,
        emailSend:String,
        threadId:String,
        response:String,
        driveFileId:String,
        demandDate:String,
        certified:String,
        createdAt: DateTime,
        UpdatedAt: DateTime,
    },

    type Litigation{
    id:String
    fileName:String
    domainId:String
    section:String
    fileDriveId:String
    fileLink:String
    date:String
    }

    type Section33 {
    Exhibit: [Litigation]
    Section33: [Litigation]
    }

    type DocumentLink {
    demandDocs:[String],
    litigationDocs:[String],
    }

    type driveFolder {
    name:String,
    link:String,
    }
`;
