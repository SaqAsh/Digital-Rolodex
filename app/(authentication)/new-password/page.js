"use client";
import { Input, Button } from "@nextui-org/react";
import { useRouter,useSearchParams } from "next/navigation";
import { useState} from "react";
//unfinished.

export default function NewPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

    const router = useRouter();
    const search = useSearchParams();
    //gets the token from link
    const token = search.get('token');
  
  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setSuccessMessage('');
      return;
    }
    setErrorMessage(''); 
    //logging for testing. 
    // console.log(JSON.stringify({ password, token }));
    try {
      const response = await fetch('/api/confirm-password-and-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);

      setSuccessMessage('Password reset successfully. Redirecting to login...'); 

      // Wait for 3 seconds, then navigate to the login page
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      console.error('ERROR:', error);
      setErrorMessage('Failed to reset password. Please try again.');
      setSuccessMessage(''); 
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-indigo-800 to-teal-400">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow rounded-2xl">
          <h2 className="flex justify-center mb-6 font-semibold text-2xl">Reset Your Password</h2>
          <p className="flex justify-center mb-4">Enter your new password</p>
          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              label="Password"
              type="password"
              variant="bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Confirm Password"
              type="password"
              variant="bordered"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            <div className="flex justify-center pb-2">
              <Button type="submit" color="primary" variant="solid">
                Reset Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
