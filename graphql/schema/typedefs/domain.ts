export const Domain = `
    type DomainResponse {
        id:String
        category:String,
        companyName : String,
        domainName : String,
        email : String,
        streetAddress:String,
        streetAddress2:String,
        secondaryAddress:[JSON],
        city:String,
        state:String,
        zip:String,
        subdomains:[SubdomainResponse],
        freelancers:[User]
        visiteDate:String,
        userJourney:String,
        userJourneyDocId:String,
        attorney:User,
        status:Status,
        score:String,
        scanDate:String,
        gmaildocument:GenerateFileResponse
        userJourneyAudit:String,
        userJourneyAuditDocId:String,
        screenReaderVideo:String,
        screenReaderVideoId:String,
        userJourneyLink:String,
        createdAt: DateTime,
        UpdatedAt: DateTime,
        demand:String,
        demandDate:String,
        phone:String,
        litigations:[Litigation]
        note:String,
        isReady:Boolean
        domainNo:String
        litigationFolderLink:String
        isUserJourneyAI:Boolean
        secondaryEmails:[String],
        driveFolderId:String,
        attornayDashboardStatus:Status
        demandDocUploaded:Boolean
    },

    type SubdomainResponse {
        id:String
        allUploaded:Boolean
        subDomainName:String,
        domainId:DomainResponse,
        createdAt: DateTime,
        updatedAt: DateTime,
    },

    type Auditfile {
        id:String
        fileName:String
        domainId: String!
        auditfileLink: String!
        auditfileId: String!
        createdAt: DateTime
    }

    type AuditVersionResponse {
        journeyFiles: [Auditfile!]!
        auditFiles: [Auditfile!]!
        videoFiles: [Auditfile!]!
    }

    type DashboardStats {
        readyDomainCount: Int,
        activeAttorneycount: Int,
        activeFreelancercount: Int,
        attorneyDomainCount: Int,
        freelancersDomainCount:Int

    }

`;
