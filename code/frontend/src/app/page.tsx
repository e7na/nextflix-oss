import ComponentWidget from "~/components/server_side";
import styles from "./page.module.css";
import { mediaFetch } from "~/lib/fetch";
import NavBar from "~/components/nav_bar";
import { trace } from "~/utils";
export default async function Home() {
  const Tv = await mediaFetch({
    category: "tv",
    cursor: 0,
    limit: 20,
    sort: "trending",
    details: true,
  }).then((res) => res.data);

  const Movies = await mediaFetch({
    category: "movies",
    cursor: 0,
    limit: 20,
    sort: "trending",
    details: true,
  }).then((res) => res.data);

  return (
    <main>
      <div>
        <title>Nextflix</title>
        <NavBar />
        <div className={styles.body}>
          <div className="relative pl-4 pb-24 lg:space-y-8 lg:pl-16 ">
            <div>
              <ComponentWidget
                params={{
                  type: "Banner",
                  media: Movies[Math.floor(Math.random() * Movies.length)]!,
                }}
              />
            </div>

            <div className="md:space-y-24">
              <ComponentWidget
                params={{
                  type: "Row",
                  medias: Movies,
                  title: "Latest Movies",
                  category: "trending",
                }}
              />
              <ComponentWidget
                params={{
                  type: "Row",
                  medias: Tv,
                  title: "Latest Shows",
                  category: "trending",
                }}
              />
            </div>

            {/* <div>
            {categoriesPlaceholder.map((category) => (
              <div key={category}>{category}</div>
            ))}
          </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}

const categoriesPlaceholder = [
  "Action",
  "Adventure",
  "Animation",
  "Crime",
  "Apocalypse",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Martial Arts",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western",
];
