"use client";
import { useRef, useState } from "react";
import DataRow from "~/components/data_row";
import { Media } from "@e7na/api-spec";
import Link from "next/link";

function Row({ title, media, category }: {
  title: string;
  media: Media[];
  category: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="h-40 space-y-0.5 md:space-y-2">
      <h2 className="w-56 cursor-pointer text-sm font-bold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        <Link
          href={category == "watchlist" ? "/watchlist" :
            media[0]!.Category == "Movie"
              ? `/movies/${category}/1`
              : `/tv/${category}/1`
          }
        >
          {title}
        </Link>
      </h2>

      <div className="group relative md:-ml-2">
        <div hidden={media.length < 6}>
          <svg
            onClick={() => handleClick("left")}
            className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition group-hover:opacity-100 hover:scale-125 
          ${!isMoved && "hidden"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </div>

        <div
          className="flex items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:space-x-2.5 md:p-2 "
          ref={rowRef}
        >
          <>
            {(() => {
              const arr = [];
              for (let i = 0; i < media.length; i++) {
                arr.push(
                  media ? <DataRow key={media[i]!.MediaID} media={media[i]!} /> : <div></div>
                );
              }
              return arr;
            })()}
          </>
        </div>
        <div hidden={media.length < 6}>
          <svg
            onClick={() => handleClick("right")}
            className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition group-hover:opacity-100 hover:scale-125"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Row;
