import jwt, { JwtPayload } from "jsonwebtoken";
import yenv from "yenv";
import { GraphQLContext } from "../utility/graphql";
const env = yenv("env.yaml", { env: "development" });

export const authMiddleware = async (req: any): Promise<any> => {
  const token = getToken(req.headers.authorization);
  const integrationToken = env.JWT_SECRET;
  // extract the authorization token from the request headers
  const authorizationToken = req.headers.authorization || "";
  // check if the request is for the signup mutation
  const isSignupMutation =
    req?.body?.query?.includes("login(") ||
    req?.body?.query?.includes("signUpUser(") ||
    req?.body?.query?.includes("changePassword(") ||
    req?.body?.query?.includes("forgotPassword(")
    ;
  // skip authorization check for signup mutation
  if (isSignupMutation) {
    return {
      userId: authorizationToken?.id,
      email: authorizationToken?.email
    };
  }

  if (token) {
    try {
      // Verify the token using the secret key
      const decodedToken = (
        await jwt.verify(token, integrationToken
        )) as JwtPayload;

      return {
        userId: decodedToken.id,
        email: decodedToken.email,
      } as GraphQLContext;
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  } else {
    throw new Error("Authorization header missing");
  }
};

const getToken = (authHeader: string | undefined) => {
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
};
