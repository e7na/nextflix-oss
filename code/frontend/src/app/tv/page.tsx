import styles from "../page.module.css";
import ComponentWidget from "~/components/server_side";
import { mediaFetch } from "~/lib/fetch";
import NavBar from "~/components/nav_bar";

const Tv = async () => {
  const trendingTv = await mediaFetch({
    category: "tv",
    cursor: 0,
    limit: 20,
    sort: "trending",
    details: true,
  }).then((res) => res.data);

  const topTV = await mediaFetch({
    category: "tv",
    cursor: 0,
    limit: 20,
    sort: "top",
    details: true,
  }).then((res) => res.data);

  const relevanceTV = await mediaFetch({
    category: "tv",
    cursor: 0,
    limit: 20,
    sort: "relevance",
    details: true,
  }).then((res) => res.data);

  return (
      <div className={styles.body}>
        <title>Tv</title>
        <NavBar />
        <div className="relative pl-4 pb-24 lg:space-y-8 lg:pl-16 ">
          <ComponentWidget
            params={{
              type: "Banner",
              media: trendingTv[Math.floor(Math.random() * trendingTv.length)]!,
            }}
          />

          <div className="md:space-y-24">
            <ComponentWidget
              params={{
                type: "Row",
                medias: trendingTv!,
                title: "Trending Now",
                category: "trending",
              }}
            />
            <ComponentWidget
              params={{
                type: "Row",
                medias: topTV!,
                title: "Top Rated",
                category: "top_rated",
              }}
            />
            <ComponentWidget
              params={{
                type: "Row",
                medias: relevanceTV!,
                title: "Relevance TV",
                category: "relevance",
              }}
            />
          </div>
        </div>
      </div>
  );
};
export default Tv;
