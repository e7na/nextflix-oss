import PageNav from "~/components/page_nav";
import ComponentWidget from "~/components/server_side";
import { Media } from "@e7na/api-spec";
import { mediaFetch } from "~/lib/fetch";
import NavBar from "~/components/nav_bar";
import SearchWidget from "~/components/search_bar";

export default async function Movies({ params }: {
  params: { query: string; type: string; num: string };
}) {
  const type = (params.type as "trending") || "top" || "relevance";
  const num = Number(params.num);
  const query = params.query;
  let currentCursor: number | null = 0;

  const movies = await mediaFetch({
    cursor: num == 1 ? 0 : (num - 1) * 96,
    limit: 96,
    search: query,
    sort: type,
    category: "all",
  }).then((res) => {
    currentCursor = res.cursor;
    return res.data;
  });

  return (
      <div>
        <title>{`Search: ${query}`}</title>
        <NavBar hideSearch />
        <SearchWidget query={query} type={type!} />
        <div
          className={`mx-12 my-8 grid gap-16 ${
            movies.length < 6
              ? "grid-cols-[260px] sm:grid-cols-[260px_260px] md:grid-cols-[260px_260px_260px] lg:grid-cols-[260px_260px_260px] xl:grid-cols-[260px_260px_260px_260px] 2xl:grid-cols-[260px_260px_260px_260px_260px]"
              : "grid-cols-fluid"
          }`}
        >
          {movies.map((movie: any) => (
            <ComponentWidget
              key={movie.MediaID}
              params={{ type: "Poster", media: movie as Media }}
            />
          ))}
        </div>
        <PageNav
          pageNum={num}
          link={`/search/${query}/${type}`}
          disabled={currentCursor ? false : true}
        />
      </div>
  );
}
