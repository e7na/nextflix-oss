import { cookies } from "next/headers";
import { hexToUtf8, md5, responseUser, trace } from "~/utils";
import { mediaFetch } from "~/lib/fetch";

export const getAllCookies = () =>
  cookies()
    .getAll()
    .reduce((cookies, { name, value }) => `${cookies}${name}=${value};`, "");

export const getItemsCookie = () => {
  const cookieStorage = cookies();

  const user = hexToUtf8(cookieStorage.get("user")?.value || "");
  const key =
    !!user && md5(JSON.stringify(responseUser.parse(JSON.parse(user))));

  const itemsCookie = !!key && cookieStorage.get(key)?.value;

  return itemsCookie;
};

export const getWatchlist = async () => {
  const itemIds: number[] = JSON.parse(getItemsCookie() || "[]");
  const Media = !!itemIds.length
    ? await mediaFetch({ ids: itemIds }).then((res) => res.data)
    : [];
  return Media;
};

export const getUserFromCookie = () => {
  const user = responseUser.safeParse(
    JSON.parse(hexToUtf8(cookies().get("user")?.value || ""))
  );
  return user.success && user.data;
};

export const fetchUser = async () => {
  const res = await fetch(
    `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/user/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: getAllCookies(),
      },
      credentials: "include",
    }
  );

  return res;
};
