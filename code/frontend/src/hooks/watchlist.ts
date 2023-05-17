import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { md5, responseUser, trace } from "~/utils";
import { getItemsCookie, getItemsKey } from "~/lib/client-cookie";

interface ParsedCookieArray {
  ids: number[];
  addItem: (id: number) => void;
  deleteItem: (id: number) => void;
  findItem: (id: number) => number | undefined;
}

export function watchlist(): ParsedCookieArray {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    // Retrieve the array of IDs from cookies on component mount
    const itemIds = getItemsCookie();
    const parsedIds = itemIds ? JSON.parse(itemIds) : [];
    setIds(parsedIds);
  }, []);

  // Add an item to the array by ID
  function addItem(id: number) {
    const updatedIds = [...ids, id];
    const [key] = getItemsKey();
    if (key) {
      setIds(updatedIds);
      setCookie(null, key, JSON.stringify(updatedIds), {
        maxAge: 31536000,
        path: "/",
        sameSite: "strict",
        secure: true,
      });
    }
  }

  // Delete an item from the array by ID
  function deleteItem(id: number) {
    const updatedIds = ids.filter((itemId) => itemId !== id);
    const [key] = getItemsKey();
    if (key) {
      setIds(updatedIds);
      setCookie(null, key, JSON.stringify(updatedIds), {
        maxAge: 31536000,
        path: "/",
        sameSite: "strict",
        secure: true,
      });
    }
  }

  // Find an item in the array by ID
  function findItem(id: number): number | undefined {
    return ids.find((itemId) => itemId === id);
  }

  return {
    ids,
    addItem,
    deleteItem,
    findItem,
  };
}
