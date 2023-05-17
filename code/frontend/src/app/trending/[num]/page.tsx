import PageNav from "~/components/page_nav";
import ComponentWidget from "~/components/server_side";
import { Media } from "@e7na/api-spec";
import { mediaFetch } from "~/lib/fetch";
import NavBar from "~/components/nav_bar";

export default async function Movies({ params }: { params: { num: string } }) {
  const num = Number(params.num);
  let currentCursor: number | null = 0;

  const trendingMovies = await mediaFetch({
    cursor: num == 1 ? 0 : (num - 1) * 96,
    limit: 96,
    sort: "trending",
    category: "all",
  }).then((res) => {
    currentCursor = res.cursor;
    return res.data;
  });

  return (
    <div>
      <title>Trending</title>
      <NavBar />
      <div
        className={`mx-12 my-24 grid gap-16 ${
          trendingMovies.length < 6
            ? "grid-cols-[260px] sm:grid-cols-[260px_260px] md:grid-cols-[260px_260px_260px] lg:grid-cols-[260px_260px_260px] xl:grid-cols-[260px_260px_260px_260px] 2xl:grid-cols-[260px_260px_260px_260px_260px]"
            : "grid-cols-fluid"
        }`}
      >
        {trendingMovies.map((movie: any) => (
          <ComponentWidget
            key={movie.MediaID}
            params={{ type: "Poster", media: movie as Media }}
          />
        ))}
      </div>
      <PageNav
        pageNum={num}
        link={`/trending`}
        disabled={currentCursor ? false : true}
      />
    </div>
  );
}
