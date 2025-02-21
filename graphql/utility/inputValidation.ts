export const regex: { [key: string]: RegExp } = {
    text: /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/,
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
    domainRegex: /https?:\/\/(?:www\.)?([^\s/$.?#]+)\b/gi

};

export const errorMessages: {
    [name: string]: string;
} = {
    required: "The field is required",
    firstName: "First name must contain only letters",
    lastName: "Last name must contain only letters",
    name: "Please enter your name",
    email: "Please enter a valid email address",
    password: "Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers",
};
