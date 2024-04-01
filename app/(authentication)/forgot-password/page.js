"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { Input, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const router = useRouter();


  const onSubmit = async (e) => {
    e.preventDefault();

    try {
     
      const emailResponse = await fetch('/api/verify-email', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), 
      });

      const emailData = await emailResponse.json();

      
      if (!emailData.exists) {
        router.push('/confirmation');
        return; // Prevent further execution if the email doesn't exist.
      }

      // If the email exists, proceed to send the password reset link.
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), 
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/confirmation');
        console.log('Success:', data);
      } else {
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-indigo-800 to-teal-400">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow rounded-2xl">
          <h2 className="flex justify-center mb-6 font-semibold text-2xl">Reset Your Password</h2>
          <p className="flex justify-center mb-4">Enter your email address</p>
          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              label="email@example.com"
              type="email"
              variant="bordered"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <div className="flex justify-center pb-2">
              <Button type="submit" color="primary" variant="solid">
                Send Reset Link
              </Button>
            </div>
          </form>
          <p className="mt-4 text-center font-semibold">
            Remember your password? <Link href="/login">Log in</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
