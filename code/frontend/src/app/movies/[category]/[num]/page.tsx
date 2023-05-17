import PageNav from "~/components/page_nav";
import ComponentWidget from "~/components/server_side";
import { mediaFetch } from "~/lib/fetch";
import { Media } from "@e7na/api-spec";
import NavBar from "~/components/nav_bar";

export default async function Movies({
  params,
}: {
  params: { category: string; num: string };
}) {
  const num = await Number(params.num);
  const category = await params.category;
  let currentCursor: number | null = 0;

  const trendingMovies = await mediaFetch(
    category == "trending"
      ? {
          category: "movies",
          cursor: num == 1 ? 0 : (num - 1) * 24,
          limit: 24,
          sort: "trending",
        }
      : {
          category: "movies",
          cursor: num == 1 ? 0 : (num - 1) * 24,
          limit: 24,
          sort: "top",
        }
  ).then((res) => {
    currentCursor = res.cursor; // what to do when the pages end?
    return res.data;
  });

  return (
    <div>
      <title>
        {category == "trending" ? "Trending Movies" : "Top Rated Movies"}
      </title>
      <NavBar />
      <div
        className={`mx-12 my-24 grid gap-16 ${
          trendingMovies.length < 6
            ? "grid-cols-[260px] sm:grid-cols-[260px_260px] md:grid-cols-[260px_260px_260px] lg:grid-cols-[260px_260px_260px] xl:grid-cols-[260px_260px_260px_260px] 2xl:grid-cols-[260px_260px_260px_260px_260px]"
            : "grid-cols-fluid"
        }`}
      >
        {trendingMovies.map((movie: Media) => (
          <ComponentWidget
            key={movie.MediaID}
            params={{ type: "Poster", media: movie as Media }}
          />
        ))}
      </div>
      <PageNav
        pageNum={num}
        categorie={category}
        movie={true}
        disabled={currentCursor ? false : true}
      />
    </div>
  );
}
