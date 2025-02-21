import { Brackets } from "typeorm";
import { Login } from "../../../../database/auth/login";
import { GraphQLContext } from "../../../utility/graphql";
import { createWhereExpression } from "../../../utility/commonMethod";
import { validUserSearchFields } from "../../../../types/searchFields";

export const userProfile = async (
  _: any,
  _param: any,
  { userId }: GraphQLContext
) => {
  const login = await Login.findOneBy({ id: userId });
  return login;
};


// get all users with global serach and pagination
export const users = async (
  _: any,
  input: { first: number, after: number, search: string },
) => {
  const { first = 10, after, search } = input;
  const userQuery = Login.createQueryBuilder("login")
    .orderBy("login.createdAt", "DESC");;

  // Implement global search
  if (search) {
    const brackets = new Brackets((qb) => {
      validUserSearchFields.forEach((field) => {
        const { searchString, params } = createWhereExpression(field, search);
        qb.orWhere(searchString, params);
      });
    });
    userQuery.andWhere(brackets);
  }

  // Paginate results
  const [users, totalCount] = await userQuery.skip(after).take(first).getManyAndCount();

  const userNodes = users.map(user => {
    return {
      node: user,
      cursor: user.id,
    };
  });

  return {
    totalCount,
    edges: userNodes,
  };
};

// get user by id
export const getUserById = async (
  _: any,
  { id }: { id: string },
) => {
  const user = await Login.createQueryBuilder().where({ id }).getOne();
  return user;
};
