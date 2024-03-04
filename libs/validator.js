import { z } from "zod";

const NON_EMPTY_MESSAGE = "This field cannot be empty";

const password = z
  .string()
  .regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), {
    message:
      "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number",
  });

const signup = z
  .object({
    email: z.string().min(1, NON_EMPTY_MESSAGE).email(),
    password: password,
    confirmPassword: password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

const login = z.object({
  email: z.string().min(1, NON_EMPTY_MESSAGE).email(),
  password: password,
});

const card = z.object({
  image: z.string().optional(),
  name: z.string().min(1, NON_EMPTY_MESSAGE),
  email: z.string().min(1, NON_EMPTY_MESSAGE).email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().min(1, NON_EMPTY_MESSAGE),
});

export default {
  signup: signup,
  login: login,
  card: card,
};
