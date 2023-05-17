import Image from "next/legacy/image";
import { User } from "@e7na/api-spec";
import NavBar from "~/components/nav_bar";
import EditForm from "./edit_form";
import { fetchUser } from "~/lib/srv-cookie";
import { trace } from "~/utils";

async function editAccount() {
  const userData = await fetchUser()
    .then((res) => res.json())
    .then((res) => User.parse(res));
  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <title>Edit Info</title>
      <NavBar />
      <Image
        src="https://assets.nflxext.com/ffe/siteui/vlv3/d0982892-13ac-4702-b9fa-87a410c1f2da/519e3d3a-1c8c-4fdb-8f8a-7eabdbe87056/AE-en-20220321-popsignuptwoweeks-perspective_alpha_website_large.jpg"
        className="-z-10 !hidden opacity-90 sm:!inline"
        layout="fill"
        objectFit="cover"
      />
      <EditForm userData={userData} />
    </div>
  );
}

export default editAccount;
