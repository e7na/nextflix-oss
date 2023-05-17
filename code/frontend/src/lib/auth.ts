import { trace } from "~/utils";

export const logIn = async (email: string, password: string) =>
  fetch(
    `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    }
  ).then((res) => res.headers.get("set-cookie"));

export async function signUp(userDetails: {
  email: string;
  password: string;
  fname: string;
  address?: string;
  gender?: "Male" | "Female";
  countryid?: string;
  lname?: string;
  phone?: string;
}) {
  /* const res =  */ await fetch(
    `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    }
  );

  return logIn(userDetails.email, userDetails.password);
}
