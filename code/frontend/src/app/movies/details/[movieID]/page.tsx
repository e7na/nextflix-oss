import styles from "../../../page.module.css";
import ComponentWidget from "~/components/server_side";
import { Media } from "@e7na/api-spec";
import { mediaFetch } from "~/lib/fetch";
import NavBar from "~/components/nav_bar";
import { cookies } from "next/headers";
import { HiArrowCircleDown, HiArrowCircleUp, HiStar } from "react-icons/hi";
import { getItemsCookie, getWatchlist } from "~/lib/srv-cookie";

export default async function MovieDetail({
  params,
}: {
  params: { movieID: string };
}) {
  const movieID = params.movieID;
  const Movie = await mediaFetch({
    ids: [Number(movieID)],
  }).then((res) => res.data[0]);

  const itemIds: number[] = JSON.parse(getItemsCookie() || "[]");
  const Media = await getWatchlist();
  return (
    <div className={styles.body}>
      <title>{Movie?.Title ?? "No Title"}</title>
      <NavBar />
      <div className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        <div>
          <ComponentWidget
            params={{ type: "Banner", media: Movie, hideInfo: true }}
          />
          <div className="flex space-x-6 pb-10 text-sm font-light">
            <h2 className="text-xl font-bold sm:inline">
              {Movie?.Category ?? "Unknown"}
            </h2>
            {Movie?.CompanyName && (
              <li>
                <h2 className="text-xl font-bold sm:inline">
                  {Movie.CompanyName}
                </h2>
              </li>
            )}
            {Movie?.GenreName && (
              <li>
                <h2 className="text-xl font-bold sm:inline">
                  {Movie.GenreName}
                </h2>
              </li>
            )}
            {Movie?.ReleaseYear && (
              <li>
                <h2 className="text-xl font-bold sm:inline">
                  {Movie.ReleaseYear?.split(" ")[3]!}
                </h2>
              </li>
            )}
            {Movie?.Rating && (
              <li>
                <h2 className="text-xl font-bold sm:inline">
                  <HiStar className="mb-1 h-6 w-6 fill-[#f62f2f] sm:inline"></HiStar>{" "}
                  {(Movie.Rating / 10).toFixed(1)} of 10
                </h2>
              </li>
            )}
            {Movie?.Popularity && (
              <li>
                <h2 className="text-xl font-bold sm:inline">
                  {parseInt(
                    Movie.Popularity.toFixed(1).toString().split(".")[1]!
                  ) >= 5 && (
                    <HiArrowCircleUp className="mb-1 h-6 w-6 fill-[#4ad8aa] sm:inline"></HiArrowCircleUp>
                  )}{" "}
                  {parseInt(
                    Movie.Popularity.toFixed(1).toString().split(".")[1]!
                  ) < 5 && (
                    <HiArrowCircleDown className="mb-1 h-6 w-6 fill-[#f62f2f] sm:inline"></HiArrowCircleDown>
                  )}{" "}
                  {Math.trunc(Movie.Popularity!)}
                </h2>
              </li>
            )}
          </div>
          {Media.length > 0 && (
            <ComponentWidget
              params={{
                type: "Row",
                medias: Media!,
                title: "From Your List",
                category: "watchlist",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
