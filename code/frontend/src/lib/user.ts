import { OnlyRequire, User } from "@e7na/api-spec";

export const getUser = async () => {
  const res = await fetch(
    `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/user/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // cookie: getAllCookies(),
      },
      credentials: "include",
    }
  );

  return res;
};

export const updateUser = async (user: OnlyRequire<User, "UserID">) => {
  const partialUser = User.partial().required({ UserID: true }).safeParse(user);
  if (!partialUser.success) {
    console.error(partialUser.error);
    return;
  }

  const res = await fetch(
    `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/user`,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        // cookie: getAllCookies(),
      },
    }
  );

  if (res.ok) {
    return getUser();
  } else {
    console.error(res.statusText);
  }
};

export const logOut = () =>
  fetch(`http://localhost:3001/api/auth/logout`, {
    method: "DELETE",
    credentials: "include",
    // headers: { cookie },
  }).then((res) => res.ok);
