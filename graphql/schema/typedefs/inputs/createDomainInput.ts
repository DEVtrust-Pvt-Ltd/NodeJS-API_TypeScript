export const CreateDomainInput = `
    input CreateDomainInput {
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
        freelancers:[String]
        visiteDate:String,
        userJourney:String,
        attorney:String,
        phone:String,
        secondaryEmails:[String],
    }

    input UpdateDomainInput {
        id:String,
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
        freelancers:[String],
        attorney:String,
        visiteDate:String,
        userJourney:String,
        score:String,
        demand:String
        ids:[String],
        phone:String,
        response:String,
        demandDate:String,
        secondaryEmails:[String],
        note:String,
        emailSend:String,
        attornayDashboardStatus:String

    }

    input CreateSubDomainInput {
        domainId: String,
        subDomainName: [String],
    }

    input UserJourneyInput {
        id: String,
        userJourney: String
        isUserJourneyAI:Boolean
    }
 `;

