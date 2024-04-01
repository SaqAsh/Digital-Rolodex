import database from "./database";

export async function verifyResetToken(token) {
  // trys to find the token that is generated in the database

  const tokenRecord = await database.passwordResetToken.findUnique({
    where: { token },
  });
  // this just checks if there is nothing returned, and also rechecks if the expiry time is earlier than the current time.
  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    console.log("expired token");
    return false; 
  }
  return tokenRecord.userId; // Returning the associated userId for further processing
}
