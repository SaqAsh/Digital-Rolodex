// will need to change email template to appy.yo's liking. 

export const Email_Template = ({ link }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-5 text-center">
      <p className="max-w-xl text-lg">
        <span className="font-bold text-2xl">Password Reset Link</span><br/>
        You've requested to reset your password. Use the link below to set up a new password. Please note that this link will <span className="font-bold">expire in 15 minutes:</span>
        <br/>
        <a href={link} className="underline font-bold text-blue-300 break-all">
          {link}
        </a>
      </p>
    </div>
  );
};

export default Email_Template;
