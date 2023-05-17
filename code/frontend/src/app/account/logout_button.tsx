"use client";
import { destroyCookie } from "nookies";
import { logOut } from "~/lib/user";

export default function Logout() {
  async function onCLick() {
    destroyCookie({}, "user");
    const ok = await logOut();
    if (!ok) return;
    window.location.href = "/auth";
  }

  return (
    <div>
      <button
        onClick={onCLick}
        className="flex items-center gap-x-2 rounded bg-[#E50914] px-5 px-5 py-1.5 text-sm font-semibold transition disabled:opacity-25 hover:opacity-75 md:py-2.5 md:px-8 md:text-xl "
      >
        log Out
      </button>
    </div>
  );
}
