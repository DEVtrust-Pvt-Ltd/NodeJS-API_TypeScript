export const edges = `
type UserEdge {
      node: User
      cursor: ID
  }

  type domainEdge {
      node: DomainResponse
      cursor: ID
  }

    type subDomainEdge {
      node: SubdomainResponse
      cursor: ID
  }

  type StatusCount {
  status: String
  count: Int
}

`;
