"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar({ hideSearch }: { hideSearch?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event: any) => {
    event.preventDefault();
    searchTerm ? (location.href = `/search/${searchTerm}/trending/1`) : null;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${isScrolled && "bg-[#141414]"
        } fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all lg:px-10 lg:py-6`}
    >
      <div className="flex items-center space-x-2 md:space-x-10">
        <Link href="/">
          <img
            src="/logo.svg"
            width={100}
            height={20}
            className="cursor-pointer object-contain transition duration-200 ease-out md:hover:scale-110"
          />
        </Link>
        <ul className="hidden space-x-4 md:flex">
          <li
            className="cursor-pointer text-sm font-light text-[#e5e5e5] 
        transition duration-[.4s] hover:text-[#b3b3b3]"
          >
            <Link href={"/"}>
              <div className="font-semibold">Home</div>
            </Link>
          </li>
          <li
            className="cursor-pointer text-sm font-light text-[#e5e5e5] 
        transition duration-[.4s] hover:text-[#b3b3b3]"
          >
            <Link href={"/trending/1"}>
              <div className="font-semibold">Trending</div>
            </Link>
          </li>
          <li
            className="cursor-pointer text-sm font-light text-[#e5e5e5] 
        transition duration-[.4s] hover:text-[#b3b3b3]"
          >
            <Link href={"/tv"}>
              <div className="font-semibold">TV Shows</div>
            </Link>
          </li>

          <li
            className="cursor-pointer text-sm font-light text-[#e5e5e5] 
        transition duration-[.4s] hover:text-[#b3b3b3]"
          >
            <Link href={"/movies"}>
              <div className="font-semibold">Movies</div>
            </Link>
          </li>

          <li
            className="cursor-pointer text-sm font-light text-[#e5e5e5] 
        transition duration-[.4s] hover:text-[#b3b3b3]"
          >
            <Link href={"/watchlist"}>
              <div className="font-semibold">My Watchlist</div>
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex space-x-4 text-sm font-light ">
        {/*search box*/}
        {!hideSearch && (
          <form onSubmit={(event) => handleSearch(event)}>
            <input
              className="relative mx-auto hidden h-6 rounded-lg border-gray-300 bg-white px-5 pt-0 pr-16 text-sm text-gray-600 only:border-2 focus:outline-none sm:inline"
              type="search"
              name="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleInputChange}
            />
          </form>
        )}
        {/*search icon*/}
        {!hideSearch && (
        <Link href={`/search/${searchTerm}/trending/1`}>
          <li>
            <svg
              className="hidden h-6 w-6 sm:inline cursor-pointer transition ease-out md:hover:scale-110 duration-[.4s] hover:text-[#b3b3b3]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                clipRule="evenodd"
              />
            </svg>
          </li>
        </Link>
        )}
        {/*bell icon*/}
        {!hideSearch && (<li>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="hidden h-6 w-6 sm:inline cursor-pointer duration-[.4s] hover:text-[#b3b3b3] transition ease-out md:hover:scale-110"
          >
            <path
              fillRule="evenodd"
              d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clipRule="evenodd"
            />
          </svg>
        </li>)}
        {hideSearch && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="hidden h-6 w-6 sm:inline cursor-pointer duration-[.4s] hover:text-[#b3b3b3] transition ease-out md:hover:scale-110"
          >
            <path
              fillRule="evenodd"
              d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {/*account icon*/}
        <Link href={`/account`}>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="hidden h-6 w-6 sm:inline cursor-pointer
              transition duration-[.4s] hover:text-[#b3b3b3] ease-out md:hover:scale-110"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>
        </Link>
      </div>
    </div>
  );
}
{
  /* <ul>
<li><Link href="/tv/1">Popular</Link></li>
<li><Link href="..">Airing Today</Link></li>
<li><Link href="..">On TV</Link></li>
<li><Link href="..">Top Rated</Link></li>
</ul>*/
}
