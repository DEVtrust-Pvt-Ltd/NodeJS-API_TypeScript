import { Login } from "../../../database/auth/login";
import { dataLoaders } from "../dataloaders";

export const userSubResolver = {
    role: async (parent: Login) => {
        if (parent.roleId === null || parent.roleId === undefined) return "";

        return await dataLoaders.roleLoader.clear(parent.roleId).load(parent.roleId);
    },
};
