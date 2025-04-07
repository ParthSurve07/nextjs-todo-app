export const getTokenFromRequest = (req) => {
  const authHeader = req.headers.get("authorization");
  return authHeader?.split(" ")[1];
};