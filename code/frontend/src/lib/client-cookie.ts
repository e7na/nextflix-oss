"use client";
import { parseCookies, setCookie } from "nookies";
import { hexToUtf8, md5, responseUser, trace, utf8ToHex } from "~/utils";
import { OnlyRequire, User } from "@e7na/api-spec";

export const getAllCookies = () =>
  Object.entries(parseCookies()).reduce(
    (cookies, [name, value]) => `${cookies}${name}=${value};`,
    ""
  );

export const getUserFromCookie = () => {
  // returns false when credentials are invalid
  const userHex = parseCookies()?.user;

  const user =
    !!userHex && responseUser.safeParse(JSON.parse(hexToUtf8(userHex)));

  return !!user && user.success && user.data;
}; // client only

export const getItemsKey = () => {
  const user = getUserFromCookie();
  const key = !!user && md5(JSON.stringify(user));

  return [key, parseCookies()] as const;
};

export const getItemsCookie = () => {
  const [key, cookieStorage] = getItemsKey();

  // Retrieve the array of IDs from cookies on component mount
  const itemsCookie = !!key && cookieStorage[key];

  return itemsCookie;
};

export const updateUser = async (user: OnlyRequire<User, "UserID">) => {
  const partialUser = User.partial().required({ UserID: true }).safeParse(user);
  if (!partialUser.success) {
    console.error(partialUser.error);
    return;
  }

  const res = await fetch(`http://localhost:${process.env}/api/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      cookie: getAllCookies(),
    },
    credentials: "include",
  });

  if (res.ok) {
    return res.headers.get("set-cookie");
  }
};

export const createUserCookie = async (user: Partial<User>) => {
  const { UserID: userid, CountryID: countryid, FirstName: name } = user;

  setCookie(
    {},
    "user",
    utf8ToHex(JSON.stringify({ userid, countryid, name })),
    {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: "strict",
      path: "/",
    }
  );

  return getUserFromCookie();
};
