import database from '@/libs/database';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { verifyResetToken } from '@/libs/token-verification';


export async function POST(req, res) {
  try {
    const { password, token } = await req.json();
    //logging for testing when needed
    // console.log(password);
    // console.log(token);

    // Verify the token and check if it's valid through the verification under libs
    const userId = await verifyResetToken(token);
    if (!userId) {
      console.log("Token is invalid or expired.");
      return NextResponse.json({ error: 'Token is invalid or expired' }, { status: 400 });
    } else {
      console.log(`Token is valid. User ID: ${userId}`);
      // Proceed with password reset process for the user with this userId

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update the user's password
      await database.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      // Invalidate the token after use
      await database.passwordResetToken.delete({
        where: {
          userId: userId,
        },
      });

      console.log("Password reset successfully");
      return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
    }
  } catch (error) {
    console.error('Failed to reset password:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
