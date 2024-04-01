import Email_Template from '@/components/Email-Template';
import { Resend } from 'resend';
import { verifyResetToken } from '@/libs/token-verification';

const resend = new Resend(process.env.RESEND_API_KEY); // this api key must be set when signing up to resend with appy's credentials.

export async function sendResetEmail(email, token) {
  //this is the particular reset link for the reset link that is mean't to be sent to the email.
  // If you change the env variable for the nextauth url, that will automatically change it to the domain when deploying.
  const resetLink= `${process.env.NEXTAUTH_URL}/new-password?token=${token}`;
  const tokenValid = await verifyResetToken(token);

  //checking if the token is valid again. 
  if (!tokenValid){
    console.error ("TOKEN INVALID");
    return {success: false, error: "TOKEN IS INVALID OR EXPIRED"};
  }
  
  try {
    // the "from" email is going to be different once appy.yo gives you an emailing domain.
    //make sure you change the email in the resend api website. 
    //refer to theh resend api doccumentation.
    
    const { data, error } = await resend.emails.send({
      from: 'Digital Rolodex <onboarding@resend.dev>',
      to: [email],
      subject: "Reset Your Password",
      react: Email_Template({ link: resetLink }),
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message || 'An error occurred' };
  }
}
