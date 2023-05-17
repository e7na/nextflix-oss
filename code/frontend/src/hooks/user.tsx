"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { responseUser } from "~/utils";
import { getUserFromCookie } from "~/lib/client-cookie";

type UserCtx = {
  user: responseUser | null;
  fetchUser: () => void;
  // setUser: React.Dispatch<React.SetStateAction<UserCtx["user"]>>;
  // logIn: ([email, password]: Parameters<typeof auth.logIn>) => Promise<void>;
  // signUp: ([userDetails]: Parameters<typeof auth.signUp>) => Promise<void>;
};

export const userContext = createContext<UserCtx>({} as any);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserCtx["user"]>(null);

  const fetchUser = () => setUser(getUserFromCookie() || null);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <userContext.Provider value={{ user, fetchUser }}>
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => useContext(userContext);

export default useUser;
