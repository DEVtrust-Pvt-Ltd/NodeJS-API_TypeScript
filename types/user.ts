export interface SignUpUserTypeInput {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    color: string;
}
export interface UpdateSignUpUserTypeInput {
    id:string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    color: string;
}
export interface UpdateProfile {
    firstName: string;
    lastName: string
}
export interface DeleteUser {
    id: string;
    isActive: boolean
}
export interface UpdatePasswordType {
    oldPassword: string;
    newPassword: string
}
