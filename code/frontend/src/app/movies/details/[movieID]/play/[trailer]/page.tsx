// "use client"
import styles from "../../../../../page.module.css";
import NavBar from "~/components/nav_bar";


export default async function MovieDetail({ params }: {
  params: { trailer: string };
}) {
  const trailer = params.trailer;

  return (
    <div className={styles.body}>
      <NavBar />
      <div className="grid h-screen place-items-center py-20">
        <iframe width="1280" height="780"
          src={`https://www.youtube.com/embed/${trailer}`}>
        </iframe>
      </div>
    </div>
  );
}

