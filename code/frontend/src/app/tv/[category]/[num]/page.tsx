import PageNav from "~/components/page_nav";
import ComponentWidget from "~/components/server_side";
import { mediaFetch } from "~/lib/fetch";
import { Media } from "@e7na/api-spec";
import NavBar from "~/components/nav_bar";

export default async function Shows({ params }: {
  params: { category: string; num: string };
}) {
  const num = await Number(params.num);
  const category = await params.category;
  let currentCursor: number | null = 0;

  const trendingTv = await mediaFetch(
    category == "trending"
      ? {
          category: "tv",
          cursor: num == 1 ? 0 : (num - 1) * 24,
          limit: 24,
          sort: "trending",
        }
      : {
          category: "tv",
          cursor: num == 1 ? 0 : (num - 1) * 24,
          limit: 24,
          sort: "top",
        }
  ).then((res) => {
    currentCursor = res.cursor;
    return res.data;
  });

  return (
      <div>
        <title>
          {category == "trending" ? "Trending Shows" : "Top Rated Shows"}
        </title>
        <NavBar />
        <div
          className={`mx-12 my-24 grid gap-16 ${
            trendingTv.length < 6
              ? "grid-cols-[260px] sm:grid-cols-[260px_260px] md:grid-cols-[260px_260px_260px] lg:grid-cols-[260px_260px_260px] xl:grid-cols-[260px_260px_260px_260px] 2xl:grid-cols-[260px_260px_260px_260px_260px]"
              : "grid-cols-fluid"
          }`}
        >
          {trendingTv.map((media: any) => (
            <ComponentWidget
              key={media.MediaID}
              params={{ type: "Poster", media: media as Media }}
            />
          ))}
        </div>
        <PageNav
          pageNum={num}
          categorie={category}
          movie={false}
          disabled={currentCursor ? false : true}
        />
      </div>
  );
}
