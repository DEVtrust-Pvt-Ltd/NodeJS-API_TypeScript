export const connections = `
type UserConnection {
    totalCount: Int
    edges: [UserEdge]
}

type DomainConnection {
    totalCount: Int
    getStatusCounts:[StatusCount]
    edges: [domainEdge]
}


type SubDomainConnection {
    totalCount: Int
    edges: [subDomainEdge]
}

`;
