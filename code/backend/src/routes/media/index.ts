import { Router } from "express";
import {
  MediaSearchRoutes,
  MediaSearchQuery,
  MediaByIDsQuery,
} from "@e7na/api-spec";
import { dbErrorHandler } from "../../utils/db.js";
import { getMediaByIDs, searchMedia } from "../../controllers/media.js";
import { validateAccessToken } from "../../utils/middlewares.js";
import jwt from "jsonwebtoken";

//* curl localhost:3001/api/media/movies?search=the\&order=ASC
//* curl localhost:3001/api/media/movies/top?cursor=1\&limit=1
//? curl localhost:3001/api/media/tv/trending?cursor=1
//? curl localhost:3001/api/media/movies?cursor=1\&limit=100
//! curl localhost:3001/api/media/movies?search=&limit=2

const router = Router();

router.use(validateAccessToken);

router.get("/details", async (req, res) => {
  const result = await getMediaByIDs(req.query as unknown as MediaByIDsQuery);
  if (!result) {
    res.status(400).send("Bad Request");
    return;
  }
  res.status(200).send(result);
});

router.get("/:category?/:sort?", async (req, res) => {
  const { category, sort } = req.params;
  if (
    (category !== "movies" && category !== "tv" && category !== "all") ||
    (sort && sort !== "trending" && sort !== "top")
  ) {
    res.status(404).send("Not Found");
    return;
  }

  const CountryID = (req as any).userData.countryid;

  const result = await searchMedia(
    req.params as MediaSearchRoutes,
    req.query as unknown as MediaSearchQuery,
    CountryID
  );
  if (!result) {
    res.status(400).send("Bad Request");
    return;
  }
  res.status(200).send(result);
});

router.use(dbErrorHandler);
export default router;

/* 
INSERT INTO Media (MediaID, Title, Category, Rating, Duration, PosterURL, Description, ReleaseYear, AddedOn, FileURL, Popularity)
VALUES
  (1, 'The Shawshank Redemption', 'Movie', 9.3, '2:22:00', 'https://www.example.com/shawshank-redemption.jpg', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', '1994-09-23', NOW(), 'https://www.example.com/shawshank-redemption.mp4', 80.5),
  (2, 'The Dark Knight', 'Movie', 9.0, '2:32:00', 'https://www.example.com/dark-knight.jpg', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', '2008-07-18', NOW(), 'https://www.example.com/dark-knight.mp4', 85.2),
  (3, 'Stranger Things','TV', 8.7, '0:51:00', 'https://www.example.com/stranger-things.jpg', 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.', '2016-07-15', NOW(), 'https://www.example.com/stranger-things.mp4', 78.9);
*/
