export const UploadFileInput = `
  input UploadFileInput {
      id: String
      files: [FileInput],
      isSkip:Boolean,
      documentId:String
      uploadfileSection:uploadfileSection
    },

  input UpdateUploadFileInput {
        id: String
        subdomainId:String
        files: [FileInput],
        isSkip:Boolean,
        uploadfileSection:uploadfileSection
      },

    input FileInput {
      mimetype: String
      path: String

    }

    input GenerateFileInput {
      domainId: String
      demandDate:String
      generatefileSection: [generatefileSection]
    }

    input UploadUserJourneyInput {
      domainId: String
      mimetype: String
      path: String
      type: UploadUserJourneyType
    }

    input DraftInput {
      domainId:String,
      generatefileSection:generatefileSection,
      templateId:String
    }

    input createMultipleDocDraft {
      domainId:String,
      generatefileSection:[generatefileSection],
      templateId:String
    }

    input UserJourneyAIInput{
      domainId:String,
      date: String
      section:String
      soap:String
      fileId:String
    }

  input UploadStampReceiptInput {
      domainId: String
      mimetype: String
      path: String
    }

`;
