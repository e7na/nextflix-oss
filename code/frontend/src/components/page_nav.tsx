"use client";
import Link from "next/link";

export default function PageNav({
  pageNum,
  categorie,
  movie,
  link,
  disabled,
}: {
  pageNum: number;
  categorie?: string;
  movie?: boolean;
  link?: string;
  disabled?: boolean;
}) {
  const currentPage = Number(pageNum);
  return (
    <div className="my-12 flex flex-col items-center text-center">
      <span className="text-sm">
        <span className="font-semibold text-gray-900 dark:text-white">
          Page {currentPage}
        </span>{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
        </span>
      </span>
      <div className="xs:mt-0 mt-2 inline-flex">
        <Link
          href={
            link
              ? `${link}/${currentPage - 1}`
              : `/${movie ? "movies" : "tv"}/${categorie}/${currentPage - 1}`
          }
        >
          <button
            disabled={currentPage == 1 ? true : false}
            className="inline-flex items-center rounded-l bg-gray-800 px-8 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-gray-900 dark:border-gray-700 dark:bg-black dark:text-gray-400 dark:hover:bg-red-900 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="mr-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            Prev
          </button>
        </Link>
        <Link
          href={
            link
              ? `${link}/${currentPage + 1}`
              : `/${movie ? "movies" : "tv"}/${categorie}/${currentPage + 1}`
          }
        >
          <button
            disabled={disabled ? true : false}
            className="inline-flex items-center rounded-r border-0 border-l border-gray-700 bg-gray-800 px-8 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-gray-900 dark:border-gray-700 dark:bg-black dark:text-red-600 dark:hover:bg-red-900 dark:hover:text-white"
          >
            Next
            <svg
              aria-hidden="true"
              className="ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}
