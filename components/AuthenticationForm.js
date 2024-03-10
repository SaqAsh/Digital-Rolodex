"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa6";
import { Input, Button } from "@nextui-org/react";
import validator from "@/libs/validator";

export default function AuthenticationForm({ type }) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(
      type === "login" ? validator.login : validator.signup,
    ),
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const buttonLabel = type === "login" ? "Login" : "Sign Up";

  const otherFormMap = {
    login: {
      question: "Don't have an account?",
      label: "Sign Up",
      remainder: "for free.",
      link: "/signup",
      forgotPassword: "/forgot-password",
    },
    signup: {
      question: "Already have an account?",
      label: "Login",
      remainder: "instead.",
      link: "/login",
    }
  };

  async function onSubmit(data) {
    setError("");
    const response = await signIn(type, {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (response.ok) {
      router.push("/");
    } else {
      console.log(response);
      setError("Invalid Email or Password");
    }
  }

  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <span
              className={"flex items-center text-xl font-bold text-primary"}
            >
              Digital Rolodex
            </span>
            <h3 className="title">
              {type === "login" ? "Welcome Back" : "Sign Up"}
            </h3>
          </div>
          {error !== "" && (
            <div className={"bg-red-400 text-white m-2 p-4 rounded-md"}>
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col bg-gray-100 px-4 py-8 sm:px-16 gap-4"
          >
            <Input
              {...register("email")}
              label="Email"
              variant={"bordered"}
              type="email"
              autoComplete={"email"}
              isInvalid={errors["email"]?.message.length > 0}
              errorMessage={errors["email"]?.message}
            />
            <Input
              {...register("password")}
              label="Password"
              variant={"bordered"}
              type="password"
              autoComplete={"password"}
              isInvalid={errors["password"]?.message.length > 0}
              errorMessage={errors["password"]?.message}
            />

            {type === "signup" && (
              <Input
                {...register("confirmPassword")}
                label="Confirm Password"
                variant={"bordered"}
                type="password"
                autoComplete={"password"}
                isInvalid={errors["confirmPassword"]?.message.length > 0}
                errorMessage={errors["confirmPassword"]?.message}
              />
            )}
            <Button
              type="submit"
              color="primary"
              variant={"solid"}
              size={"lg"}
              className={"button mt-4"}
              isLoading={isSubmitting}
            >
              {buttonLabel}
            </Button>
            {/* This is for the forgot password button rendering, it is a conditional render */}
            {type === "login" && (
            <div className="text-center my-2">
              <Link href={otherFormMap.login.forgotPassword}>
                  Forgot Password?
              </Link>
            </div>
          )}
            <span className={"divider-text"}>Or</span>
            <Button
              className={"button bg-white"}
              variant={"solid"}
              size={"lg"}
              startContent={<FaGoogle />}
              onClick={() => signIn("google")}
            >
              {`${buttonLabel} with Google`}
            </Button>
            <p className="text-center text-sm text-gray-600">
              {otherFormMap[type].question}&nbsp;
              <Link
                href={otherFormMap[type].link}
                className="font-semibold text-gray-800"
              >
                {otherFormMap[type].label}
              </Link>
              &nbsp;{otherFormMap[type].remainder}
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
