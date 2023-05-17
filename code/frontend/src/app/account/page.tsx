import { Authenticator } from "~/components/authenticator";
import NavBar from "~/components/nav_bar";
import styles from "../page.module.css";
import Banner from "~/components/title_banner";
import Logout from "./logout_button";
import Link from "next/link";

export default async function account() {
  return (
    <Authenticator>
      <div>
        <title>Account</title>
        <NavBar />
        <div className={styles.body}>
          <div className="relative pl-4 pb-24 lg:space-y-8  ">
            <Banner
              account={true}
              description="Hope you're having a great day!"
            />
            <div className="flex grid grid-cols-[160px_160px] items-center gap-3 py-10 px-7">
              <Link href={"/account/edit"}>
                <button className="flex items-center gap-x-2 rounded bg-[#E50914] px-10 px-5 py-1.5 text-sm font-semibold transition disabled:opacity-25 hover:opacity-75 md:py-2.5 md:px-8 md:text-xl ">
                  Edit Info
                </button>
              </Link>
              <Logout />
            </div>
          </div>
        </div>
      </div>
    </Authenticator>
  );
}
