import Image from "next/image";
import { getUserFromCookie } from "~/lib/srv-cookie";

export default function Banner({
  title,
  description,
  account,
}: {
  title?: string;
  description?: string;
  account?: boolean;
}) {
  let user: any;

  if (account) {
    user = getUserFromCookie();
  }

  return (
    <div className="flex h-[25vh] w-full flex-col justify-end space-x-6 space-y-6 py-24 pb-0 md:h-[30vh] lg:h-[45vh] lg:pb-10">
      <div className="absolute top-0 left-0 -z-10 h-[30rem] w-screen lg:h-[37rem] ">
        {
          <Image
            className=" absolute top-0 left-0 -z-10 w-screen"
            src="https://assets.nflxext.com/ffe/siteui/vlv3/d0982892-13ac-4702-b9fa-87a410c1f2da/519e3d3a-1c8c-4fdb-8f8a-7eabdbe87056/AE-en-20220321-popsignuptwoweeks-perspective_alpha_website_large.jpg"
            alt={"no alt text :("}
            style={{ objectFit: "cover" }}
            fill
            priority
          />
        }
      </div>
      <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
        {account ? `Hi ${user.name}` : title ?? "no title"}
      </h1>
      <p className=" w-screen text-xs text-shadow-md md:text-lg lg:max-w-2xl lg:text-2xl">
        {description ?? "no overview :("}
      </p>
    </div>
  );
}
