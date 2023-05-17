import Image from "next/image";
import Link from "next/link";
import { IMAGE_URL_MEDRES, IMAGE_PlaceHolder } from "~/utils";
import { Media } from "@e7na/api-spec";

export default function MediaWidget({ media }: { media: Media }) {

  return (
    <div className="flex flex-wrap cursor-pointer transition duration-200 ease-out md:hover:scale-105 max-w-[260px]">
    <div className="w-1/10">
      <div
        className={`relative h-28 md:h-36 md:min-w-[260px] max-w-[260px]`}
      >
        <Link
          href={
            media.Category == "TV"
              ? `/tv/details/${media?.MediaID}`
              : `/movies/details/${media?.MediaID}`
          }
        >
          {
            <div className=" relative h-full w-full">
              <Image
                className=" rounded-sm object-cover md:rounded"
                src={
                  media.BackdropURL || media.PosterURL
                    ? IMAGE_URL_MEDRES + (media.BackdropURL ?? media.PosterURL)
                    : IMAGE_PlaceHolder
                }
                alt={media.Title ?? "no title"}
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                fill
              />
            </div>
          }
        </Link>
      </div>
      <h1 className=" max-w-[260px] font-bold px-2 pt-2 text-sm text-[#e5e5e5] md:text-l whitespace-nowrap overflow-hidden">{`${media.Title}`}</h1>
    </div>
  </div>
  
  

  );
}
