"use client";
import { User } from "@e7na/api-spec";
import Image from "next/legacy/image";
import { useState } from "react";
import { logIn } from "~/lib/auth";
import { createUserCookie, getUserFromCookie } from "~/lib/client-cookie";
import { getUser } from "~/lib/user";
import { trace } from "~/utils";

function login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    // perform form validation
    let errors: { [key: string]: string | Partial<FormData> } = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }
    // else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   errors.email = 'Invalid email format';responseUser.
    // }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 4) {
      errors.password = "Password must be at least 4 characters";
    }

    setFormErrors({ ...formErrors, ...errors });

    // submit the form if there are no errors
    if (Object.keys(errors).length === 0) {
      await logIn(formData.email, formData.password);
      const user = await getUser()
        .then((res) => res.json())
        .then((res) => User.parse(res));
      await createUserCookie(user);

      window.location.href = "/";
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <title>Sign In</title>
      <Image
        src="https://assets.nflxext.com/ffe/siteui/vlv3/d0982892-13ac-4702-b9fa-87a410c1f2da/519e3d3a-1c8c-4fdb-8f8a-7eabdbe87056/AE-en-20220321-popsignuptwoweeks-perspective_alpha_website_large.jpg"
        className="-z-10 !hidden opacity-90 sm:!inline"
        layout="fill"
        objectFit="cover"
      />
      <img
        src="/logo.svg"
        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
        width={150}
        height={150}
      />

      <form
        onSubmit={(event) => handleSubmit(event)}
        className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl font-semibold text-white">Sign In</h1>
        <div className="space-y-4">
          <label className="inline-block w-full">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
            />
            <p className="p-1 text-[13px] font-light  text-[#E50914]">
              {formErrors.email}
            </p>
          </label>
          <label className="inline-block w-full">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
            />
            <p className="p-1 text-[13px] font-light  text-[#E50914]">
              {formErrors.password}
            </p>
          </label>
        </div>
        <button
          className="w-full rounded bg-[#E50914] py-3 font-semibold"
          type="submit"
          onClick={(event) => handleSubmit(event)}
        >
          Sign In
        </button>
        <div className="flex grid grid-cols-[83px_85px] items-center justify-center gap-6">
          <button
            className="w-25 rounded bg-[#333333] py-3 font-semibold"
            type="button"
            onClick={() =>
              (location.href = `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/auth/google`)
            }
          >
            <img
              src="/google.svg"
              width={28}
              height={28}
              className="ml-7 cursor-pointer object-contain transition duration-200 ease-out md:hover:scale-110"
            />
          </button>
          <button
            className="w-25 flex-wrap rounded bg-[#333333] py-3 font-semibold "
            type="button"
            onClick={() =>
              (location.href = `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/auth/discord`)
            }
          >
            <img
              src="/discord.svg"
              width={30}
              height={30}
              className="ml-7 cursor-pointer object-contain transition duration-200 ease-out md:hover:scale-110"
            />
          </button>
        </div>
        <div className="text-[gray]">
          New to Nextflix?{" "}
          <button
            className="cursor-pointer text-white hover:underline"
            type="submit"
            onClick={() => (location.href = `/auth/signup`)}
          >
            Sign up now
          </button>
        </div>
      </form>
    </div>
  );
}

export default login;
