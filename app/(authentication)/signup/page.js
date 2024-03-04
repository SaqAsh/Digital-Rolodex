import AuthenticationForm from "@/components/AuthenticationForm";

export const metadata = {
  title: "Sign Up",
};

export default function RegisterPage() {
  return <AuthenticationForm type="signup" />;
}
