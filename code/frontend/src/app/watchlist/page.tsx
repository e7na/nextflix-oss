import NavBar from "~/components/nav_bar";
import styles from "../page.module.css";
import { mediaFetch } from "~/lib/fetch";
import ComponentWidget from "~/components/server_side";
import Banner from "~/components/title_banner";
import { Authenticator } from "~/components/authenticator";
import { getItemsCookie } from "~/lib/srv-cookie";

async function watchlistPage() {
  const itemsCookie = getItemsCookie();
  const itemIds: number[] = JSON.parse(itemsCookie || "[]");
  const Media = itemIds.length
    ? await mediaFetch({ ids: itemIds }).then((res) => res.data)
    : [];

  return (
    <Authenticator>
      <title>Watchlist</title>
      <NavBar />
      <div className={styles.body}>
        <div className="relative pl-4 pb-24 lg:space-y-8 lg:pl-16 ">
          <Banner
            title="My Watchlist"
            description="Discover, organize, and indulge in a personalized cinematic experience with your Watchlist."
          />
          <div
            className={`mx-12 my-24 grid gap-16 ${
              itemIds.length < 6
                ? "grid-cols-[260px] sm:grid-cols-[260px_260px] md:grid-cols-[260px_260px_260px] lg:grid-cols-[260px_260px_260px] xl:grid-cols-[260px_260px_260px_260px] 2xl:grid-cols-[260px_260px_260px_260px_260px]"
                : "grid-cols-fluid"
            }`}
          >
            {Media.map((media) => (
              <ComponentWidget
                key={media.MediaID}
                params={{ type: "Poster", media }}
              />
            ))}
          </div>
          {Media.length == 0 && (
            <div className="px-6 text-xl font-semibold">
              Your watchlist is empty. Add some titles to your watchlist to get
              started.
            </div>
          )}
        </div>
      </div>
    </Authenticator>
  );
}

export default watchlistPage;
