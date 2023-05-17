import {
  MediaSearchRoutes,
  MediaSearchQuery,
  MediaByIDsQuery,
} from "@e7na/api-spec";
import { paginatedQuery } from "../utils/db.js";
import pool from "../db/db_connector.js";

const detailColumns = `m.MediaID\
, m.Category\
, m.Title\
, m.PosterURL\
, m.BackdropURL\
, m.Description\
, m.ReleaseYear\
, m.AddedOn\
, m.Rating\
, m.Popularity\
, c.CompanyName\
`;

const nonDetailColumns = "m.Title, m.MediaID, m.PosterURL, m.Category";

export const searchMedia = async (
  { category: c, sort: s }: MediaSearchRoutes,
  query: MediaSearchQuery,
  country: string
) => {
  const params = MediaSearchQuery.safeParse(query);
  if (!params.success) return false;

  const { search, cursor: offset, limit, order, details } = params.data;
  const category = c == "movies" ? "Movie" : c == "tv" ? "TV" : "";
  const sort = s == "trending" ? "Popularity" : s == "top" ? "Rating" : s;

  const from = `Media m\
  INNER JOIN CompanyHasMedia cm ON m.MediaID = cm.MediaID\
  INNER JOIN Companies c ON cm.CompanyID = c.CompanyID\
  INNER JOIN CompanyInRegion cr ON cr.CompanyID = c.CompanyID\
  INNER JOIN Regions r ON cr.CompanyRegion = r.RegionID\
  AND r.CountryID = :country\
`;

  return await paginatedQuery(
    {
      select: details ? detailColumns : nonDetailColumns,
      from,
      where: [
        category && `m.Category = '${category}'`,
        search && "m.Title LIKE :name",
      ],
      sort: sort && `${sort} ${order}`,
      offset: offset || 0,
      limit,
    },
    {
      name: `%${search?.replace("%", "\\%")}%`,
      country,
    }
  );
};

export const getMediaByIDs = async (query: MediaByIDsQuery) => {
  const params = MediaByIDsQuery.safeParse(query);
  if (!params.success) return false;

  const { ids } = params.data;

  const from = `Media m\
  INNER JOIN CompanyHasMedia chm ON m.MediaID = chm.MediaID\
  INNER JOIN Companies c ON chm.CompanyID = c.CompanyID\
`;

  const [rows] = await pool.execute(
    `SELECT ${detailColumns} FROM ${from} WHERE m.MediaID IN (${ids})`
  );
  return { data: rows };
};
