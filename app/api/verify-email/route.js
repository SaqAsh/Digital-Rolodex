import database from "@/libs/database";
import { GenerateToken } from "@/libs/token-generation";
import { sendResetEmail } from "../send/route";

export async function POST(req) {
  const { email } = await req.json();

  try {
    //checks the database to see if the email exists.
    const user = await database.user.findFirst({
      where: { email },
    });

    if (user) {
      // Generate a unique token and save it with an expiry date
      const token = await GenerateToken(user.id);

      // Send the reset email with the token
      const { success, error } = await sendResetEmail(email, token);

      if (!success) {

        console.error('Failed to send reset email:', error);
      }

      // Respond with success, but don't indicate whether the email was found for privacy
      return new Response(JSON.stringify({ message: "If an account with that email exists, a reset link has been sent." }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // For privacy, don't reveal whether an email was found or not
      return new Response(JSON.stringify({ message: "If an account with that email exists, a reset link has been sent." }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
}
