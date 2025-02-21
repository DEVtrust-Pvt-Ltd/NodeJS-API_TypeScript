export const userInput = `
input CreateUserInput {
    email:String,
    firstName : String,
    lastName : String,
    role : RoleName,
    color:String,
}

input UpdateUserInput{
    email:String,
    firstName : String,
    lastName : String,
    role : String,
    color:String,
    id:String
}

input UpdateProfileInput {
    firstName : String,
    lastName : String,
}

input DeleteUserInput {
    id : String,
    isActive : Boolean,
}

input UpdatePasswordInput {
    oldPassword : String,
    newPassword: String,
}
`;
