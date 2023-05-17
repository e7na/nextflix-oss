import Link from "next/link";
import Image from "next/image";
import { IMAGE_URL_MEDRES, IMAGE_PlaceHolder } from "~/utils";
import { Media } from "@e7na/api-spec";

export default function MediaWidget({ media }: {
  media: Media;
}) {
  return (
    <div  className="rounded-lg cursor-pointer transition duration-200 ease-out md:hover:scale-105 ">
      <Link
        href={
          media.Category == "Movie"
            ? `/movies/details/${media.MediaID}`
            : `/tv/details/${media.MediaID}`
        }
      >
        {
          <Image
            className="rounded-lg max-h-[32.8rem] max-w-[17.8rem]"
            src={media.PosterURL ? IMAGE_URL_MEDRES + (media.PosterURL) : IMAGE_PlaceHolder}
            width={600}
            height={900}
            alt={media.Title ?? "no title"}
            priority
          />
        }
      </Link>
      <h1 className="font-bold px-2 pt-2">{`${media.Title}`}</h1>
    </div>
  );
}
