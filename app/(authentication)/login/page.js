import AuthenticationForm from "@/components/AuthenticationForm";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <AuthenticationForm type="login" />;
}
