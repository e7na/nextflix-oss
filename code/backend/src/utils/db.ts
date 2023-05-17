import { Request, Response, NextFunction } from "express";
import { pool } from "../db/db_connector.js";

export async function paginatedQuery(
  // prettier-ignore
  { select, from, where: dirty_where, sort, offset, limit }: {
    select: string;
    from: string;
    where?: (string|undefined)[];
    sort?: string;
    offset: number;
    limit: number;
  },
  parameters?: Object
) {
  const where = dirty_where?.filter(Boolean).join(" AND ") || "";
  // sadge: https://github.com/sidorares/node-mysql2/issues/386
  const [rows] = (await pool.execute(
    `SELECT ${select} FROM ${from}` +
      (where ? ` WHERE ${where}` : "") +
      (sort ? ` ORDER BY ${sort}` : "") +
      ` LIMIT ${limit} OFFSET ${offset}`,
    parameters
  )) as unknown as [unknown[]];

  return {
    data: rows,
    cursor: rows.length < limit ? null : offset + limit,
  };
}

export function dbErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  switch (err?.code) {
    case "ECONNREFUSED":
    case "ERR_DB_BAD_TYPE":
    case "ETIMEDOUT":
    case "EAI_AGAIN":
      console.error("ERROR: ", err);
      res.status(500).send("Internal Server Error");
      break;
    case "ER_PARSE_ERROR":
    case "ER_WRONG_ARGUMENTS":
      console.error("ERROR: ", err);
      throw new Error("Invalid SQL shouldn't live in runtime :(", err);
    default:
      console.error(
        "ERROR: ",
        err,
        "\n------------------------------------------------------------------------------",
        "\n              UNHANDLED EXCEPTION client request will timeout",
        "\n------------------------------------------------------------------------------"
      );
  }
}

/*
// export async function paginatedQuery(
//   sql: {
//     select: string;
//     from: string;
//     where?: (string | undefined)[];
//     sort?: string;
//   },
//   values: any,
//   page: number
// ): Promise<MediaSearchResult> {
//   const offset = (page - 1) * ITEMS_PER_PAGE;
//   const { select, from, where: dirty_where, sort } = sql;
//   const where = dirty_where?.filter(Boolean).join(" AND ") || "";

//   // prettier-ignore
//   const { 0: [{ total_results }] } = await pool.execute(
//     `SELECT COUNT(${select}) as total_results FROM ${from}` +
//     (where ? ` WHERE ${where}` : ""),
//     values
//   ) as any;

//   // assert that total_results is a number
//   if (!((n): n is number => !isNaN(n))(total_results))
//     throw {
//       code: "ERR_DB_BAD_TYPE",
//       message: "total_results is not a number",
//     };

//   const total_pages = Math.ceil(total_results / ITEMS_PER_PAGE);

//   if (page > total_pages || total_results < 1) {
//     return {
//       page,
//       total_pages,
//       total_results,
//     };
//   }

//   const { 0: rows } = await pool.execute(
//     `SELECT ${select} FROM ${from}` +
//       (where ? ` WHERE ${where}` : "") +
//       (sort ? ` ORDER BY ${sort}` : "") +
//       " LIMIT :limit OFFSET :offset",
//     Object.assign(values, { offset: `${offset}`, limit: `${ITEMS_PER_PAGE}` })
//   );

//   return {
//     data: rows as Media[],
//     page,
//     total_pages,
//     total_results,
//   };
// }
*/
