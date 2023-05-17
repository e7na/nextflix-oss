"use client"
import Link from "next/link";
import { useState } from "react";

export default function SearchWidget({ query, type }: { query: string, type: string }) {
    const [searchType, setSearchType] = useState(`${type}`);
    const [searchTerm, setSearchTerm] = useState(`${query}`);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        // console.log(event.target.value);
        setSearchType(event.target.value as string);
    };

    const handleSearch = (event: any) => {
        event.preventDefault();
        searchTerm ? (location.href = `/search/${searchTerm}/${searchType}/1`) : null;
    };

    return (
        <div className="flex items-center justify-center pt-20">
            <div className="flex space-x-4 text-sm font-light ">
                <form onSubmit={(event) => handleSearch(event)} >
                    <input
                        className="relative mx-auto hidden h-8 rounded-lg border-gray-300 bg-white px-5 pt-0 pr-36 text-sm text-gray-600 only:border-2 focus:outline-none sm:inline"
                        type="search"
                        name="search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                </form>
                <label className="inline-block w-full">
                    <select id="type" name="type" value={searchType} onChange={handleTypeChange} className=" flex w-22 rounded border-b-1 bg-[#333333] px-2 py-1.5 placeholder-[gray] outline-none focus:bg-[#454545]">
                        <option value="trending">Trending</option>
                        <option value="top">Top</option>
                        <option value="relevance">Relevance</option>
                    </select>
                </label>
                <Link href={`/search/${searchTerm}/${searchType}/1`}>
                    <svg
                        className="hidden h-7 w-7 sm:inline cursor-pointer
            transition duration-[.4s] hover:text-[#b3b3b3] cursor-pointer transition duration-200 ease-out md:hover:scale-110"
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
                </Link>
            </div>
        </div>
    );
}
