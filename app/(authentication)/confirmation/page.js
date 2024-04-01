"use client";
import Link from "next/link";

export default function Confirmation(){

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-r from-indigo-800 to-teal-400">
          <div className="w-full max-w-md">
            <div className="bg-white p-8 shadow rounded-2xl">
              <h2 className="flex justify-center mb-6 font-semibold text-l">
                Reset Link Sent!
              </h2>
              <p className="flex justify-center mb-6 font-semibold text-sm">
                Please check your inbox and junk mail for reset link
              </p>
              {/* <form onSubmit={onSubmit} className="space-y-6">
                <Input 
                  label="We'll send you a reset link to your email"
                  type="email"
                  variant="bordered"
                />
                {/* Centering the button */}
                {/* <div className="flex font justify-center pb-2">
                  <Button type="submit" color="primary" variant="solid">
                    Send Reset Link
                  </Button>
                </div>
              </form> */} 
              <p className="mt-4 text-center font-semibold">
                Done Resetting?&nbsp;
                <Link href="/login">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      );


}