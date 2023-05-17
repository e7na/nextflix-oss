"use client"
import Image from "next/image";
import Link from 'next/link';
import { FaPlay } from "react-icons/fa";
import { HiEye, HiInformationCircle, HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { IMAGE_URL_FULLRES, IMAGE_PlaceHolder, Video } from "~/utils";
import { Media } from "@e7na/api-spec";
import { watchlist } from "~/hooks/watchlist";
import { useEffect, useState } from "react";

export default function Banner({ media, trailer, hideInfo }: {
  media: Media,
  trailer: Video | undefined
  hideInfo?: boolean
}) {

  if (!media) {
    return null;
  }
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, deleteItem, findItem } = watchlist();
  useEffect(() => {
    findItem(media!.MediaID) ? setIsAdded(true) : setIsAdded(false);
  })
  function listBtn() {
    if (isAdded) {
      return <button onClick={() => { findItem(media!.MediaID) ? deleteItem(media!.MediaID) : addItem(media!.MediaID) }}
        className="flex items-center gap-x-2 rounded bg-[gray]/70 px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl "
      >
        Remove from List <HiMinusCircle className="h-5 w-5 md:h-8 md:w-8" />{" "}
      </button>;

    } else {
      return <button onClick={() => { findItem(media!.MediaID) ? deleteItem(media!.MediaID) : addItem(media!.MediaID) }}
        className="flex items-center gap-x-2 rounded bg-[gray]/70 px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl "
      >
        Add To List <HiPlusCircle className="h-5 w-5 md:h-8 md:w-8" />{" "}</button>
    }
  }
  return (
    <div className="flex flex-col space-y-6 py-24 md:space-y-6 lg:h-[65vh] justify-end pb-12">
      <div className="absolute top-0 left-0 -z-10 lg:h-[80vh] sm:h-[58vh] h-[28rem] w-screen ">
        {
          <Image
            className=" absolute top-0 left-0 -z-10 w-screen"
            src={(media.BackdropURL || media.PosterURL) ? IMAGE_URL_FULLRES + (media.BackdropURL ?? media.PosterURL) : IMAGE_PlaceHolder}
            alt={media?.Title ?? "no alt text :("}
            style={{ objectFit: "cover" }}
            fill
            priority
          />
        }
      </div>

      <h1 className="text-2xl font-bold md:text-4xl lg:text-6xl">
        {media?.Title ?? "no title"}
      </h1>
      <p
        className=" max-w-xs  text-xs  text-shadow-md
                    md:max-w-lg  md:text-lg lg:max-w-2xl lg:text-2xl"
      >
        {media ? media.Description : "no overview :("}
      </p>

      <div className="flex space-x-3">
        <button onClick={() => window.location.href = `/movies/details/${media.MediaID}/play/${trailer?.key}`} disabled={trailer ? false : true} className="flex items-center gap-x-2 rounded bg-white px-5 py-1.5 text-sm font-semibold text-black transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl">
          <FaPlay className="h-4 w-4 text-black md:h-6 md:w-6" />
          Play
        </button>
        {!hideInfo && (<Link href={`${media!.Category == "Movie"
          ? `/movies/details/${media!.MediaID}`
          : `/tv/details/${media!.MediaID}`}`}>
          <button
            className="flex items-center gap-x-2 rounded bg-[gray]/70 px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl "
          >
            More Info <HiInformationCircle className="h-5 w-5 md:h-8 md:w-8" />{" "}
          </button>
        </Link>)}
        {hideInfo && (listBtn())}
        <Link href={`https://youtube.com/watch?v=${trailer?.key}`}>
          <button
            disabled={trailer ? false : true}
            className="/70 flex items-center gap-x-2 rounded bg-red-600 px-5 py-1.5 text-sm font-semibold transition disabled:opacity-25 hover:opacity-75 md:py-2.5 md:px-8 md:text-xl "
          >
            Watch Trailer <HiEye className="h-5 w-5 md:h-8 md:w-8" />{" "}
          </button>
        </Link>
      </div>
    </div>
  );
}
