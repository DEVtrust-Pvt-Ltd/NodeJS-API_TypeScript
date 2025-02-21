export const User = `
type User {
    id: String,
    firstName:String,
    lastName:  String,
    email: String,
    color:String,
    isActive: Boolean,
    role : Role
}
type UserWithToken {
    token: Token
    info: User
}
type Token{
    token:String
}

type Role {
    id:String
    roleName:String
    roleConstraint:String
}

type  Status {
    id:String
    statusName:String
    statusConstraint:String
    color:String
}

type DeleteUserResponse {
  id: String!
  isActive: Boolean!
}
type UsersRolesAndStatuses{
    attorneys:[User],
    managers:[User],
    freelancers:[User],
    users:[User],
    statuses:[Status],
    roles:[Role]
    attornayDashboardStatus:[Status]
}

`;
