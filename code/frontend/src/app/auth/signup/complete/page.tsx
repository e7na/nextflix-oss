import Image from "next/legacy/image";
import { fetchUser } from "~/lib/srv-cookie";
import { Form } from "./form";
import { User } from "@e7na/api-spec";
import { getUserFromCookie } from "~/lib/srv-cookie.js";
import { trace } from "~/utils";
import { redirect } from "next/navigation";

async function login() {
  const userDetails = await fetchUser()
    .then((res) => res.json())
    .then((res) => User.parse(res));
  if (userDetails.CountryID) redirect("/");

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
      <Form userDetails={userDetails} />
    </div>
  );
}

export default login;
