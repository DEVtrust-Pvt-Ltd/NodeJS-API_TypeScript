
export interface GraphQLContext {
    userId: string;
    email: string;
  }
  
export const DEFAULT_CACHE_2H = 1000 * 60 * 60 * 2;