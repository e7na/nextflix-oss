import styles from "../page.module.css";
import ComponentWidget from "~/components/server_side";
import { mediaFetch } from "~/lib/fetch";
import NavBar from "~/components/nav_bar";

const Movies = async () => {
  const trendingMovies = await mediaFetch({
    category: "movies",
    cursor: 0,
    limit: 20,
    sort: "trending",
    details: true,
  }).then((res) => res.data);

  const topMovies = await mediaFetch({
    category: "movies",
    cursor: 0,
    limit: 20,
    sort: "top",
    details: true,
  }).then((res) => res.data);
  
  const relevanceMovies = await mediaFetch({
    category: "movies",
    cursor: 0,
    limit: 20,
    sort: "relevance",
    details: true,
  }).then((res) => res.data);

  return (
      <div className={styles.body}>
        <title>Movies</title>
        <NavBar />
        <div className="relative pl-4 pb-24 lg:space-y-8 lg:pl-16 ">
          <div>
            <ComponentWidget
              params={{
                type: "Banner",
                media:
                  trendingMovies[
                    Math.floor(Math.random() * trendingMovies.length)
                  ]!,
              }}
            />
          </div>

          <div className="md:space-y-24">
            <ComponentWidget
              params={{
                type: "Row",
                medias: trendingMovies!,
                title: "Trending Now",
                category: "trending",
              }}
            />
            <ComponentWidget
              params={{
                type: "Row",
                medias: topMovies!,
                title: "Top Rated",
                category: "top_rated",
              }}
            />
            <ComponentWidget
              params={{
                type: "Row",
                medias: relevanceMovies!,
                title: "Relevance Movies",
                category: "relevance",
              }}
            />
          </div>
        </div>
      </div>
  );
};

export default Movies;
