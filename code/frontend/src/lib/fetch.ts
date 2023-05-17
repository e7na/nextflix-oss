import { guardedParse } from "@e7na/api-spec";
import { MediaPage, MediaSearchString, parseQuery, trace } from "~/utils";
import { redirect } from "next/navigation";
import { getAllCookies } from "~/lib/srv-cookie";

export async function mediaFetch(input: MediaSearchString) {
  const res = await fetch(parseQuery(input), {
    method: "GET",
    credentials: "include",
    // the `fetch` documentation states that "force-cache" is the default mode
    // for server component fetches (which is what we're doing here) but I
    // believe that writing the config by hand drops all defaults, zay ma
    // embare7 kan bayez 3shan 3ayzny akteb enno method "GET"
    // note that this is the only fetch that works correctly, fetches from
    // tmdb are not cached still
    cache: "force-cache",
    headers: { cookie: getAllCookies() },
  });

  if (res.status == 401) {
    // destroyCookie({}, "user"); // useless, cookies here are read-only
    redirect("http://localhost:3000/auth");
    // throw new Error("Unauthorized");
  }

  return guardedParse(MediaPage, await res.json());
}
