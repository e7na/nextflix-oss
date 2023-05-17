import { redirect } from "next/navigation";
import { getUserFromCookie } from "~/lib/srv-cookie";

export const Authenticator = (props: { children: any }) => {
  const { children } = props;
  const user = getUserFromCookie();

  if (!user) redirect("/auth");

  return <>{children}</>;
};
