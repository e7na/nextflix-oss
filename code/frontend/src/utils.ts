import {
  API_BASE_URL,
  MediaSearchRoutes,
  MediaSearchQuery,
  guardedParse,
  User,
  Media,
  MediaByIDsQuery,
  z,
} from "@e7na/api-spec";
import { createHash } from "crypto";
import jwtDecode from "jwt-decode";
import nookies from "nookies";

export { z };

export const trace = <T>(o: T, s?: string): T => {
  console.log(s ?? "", o);
  return o;
};

export const convert =
  (from: BufferEncoding, to: BufferEncoding) => (str: string) =>
    Buffer.from(str, from).toString(to);

export const utf8ToHex = convert("utf8", "hex");
export const hexToUtf8 = convert("hex", "utf8");

export const md5 = (content?: string | null) =>
  !!content && createHash("md5").update(content).digest("hex");

export function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

export async function getTmdbInfo(title: string, type: string) {
  const tmdbMedia = await fetch(
    (type == "Movie" ? searchMovies_URL : searchTv_URL) + title
  )
    .then((res) => res.json())
    .then((data) => data.results);
  if (tmdbMedia) return tmdbMedia[0];
}

export async function getTrailers(id: string | number, type: string) {
  const trailers = await fetch(
    `${BASE_URL}/${
      type == "Movie" ? "movie" : "tv"
    }/${id}/videos?${KEY}&language=en-US`
  )
    .then((res) => res.json())
    .then((data) => data.results);

  let trailer: Video | undefined;

  trailers?.forEach((element: Video) => {
    if (element.type == "Trailer" && element.site == "YouTube") {
      trailer = element;
    }
  });

  return trailer;
}

export const parseQuery = (params: MediaSearchString) =>
  guardedParse(MediaSearchString, params);

type AFC<P = {}> = (
  ...args: Parameters<React.FC<P>>
) => Promise<ReturnType<React.FC<P>>>;

export function asyncWrapper<T extends AFC<any>>(
  component: T
): React.FC<T extends AFC<infer P> ? P : never> {
  return component as any;
}

export const MediaSearch = MediaSearchQuery.merge(
  MediaSearchRoutes.extend({
    sort: MediaSearchRoutes.shape.sort.or(
      z.literal("relevance").transform(() => undefined)
    ),
  })
).transform((input) => {
  const { search, cursor, limit, order, category, sort, details } = input;

  return (
    `${API_BASE_URL}/media/${category}` +
    (sort ? `/${sort}?` : "?") +
    (search ? `search=${search}&` : "") +
    (details ? `details=${details}&` : "") +
    `cursor=${cursor}&limit=${limit}&order=${order}`
  );
});

const MediaByIDs = MediaByIDsQuery.extend({
  ids: z
    .number()
    .array()
    .min(1)
    .transform((input) => input.join(",")),
  search: z.undefined(),
}).transform((input) => {
  const { ids } = input;

  return `${API_BASE_URL}/media/details?ids=${ids}`;
});

export const MediaSearchString = MediaSearch.or(MediaByIDs);
export type MediaSearchString = z.input<typeof MediaSearchString>;

export const MediaPage = z.object({
  data: Media.array().default([]),
  cursor: MediaSearchQuery.shape.cursor.or(z.any().transform(() => null)),
});
export type MediaPage = z.output<typeof MediaPage>;

export const responseUser = z
  .object({
    userid: z.number(),
    name: User.shape.FirstName.optional().nullable(),
    countryid: User.shape.CountryID.optional().nullable(),
  })
  .optional()
  .nullable()
  .default(null);

export type responseUser = z.output<typeof responseUser>;

// START TRASH: don't use these types, import the ones in @e7na/api-spec
/* 
export const negate = <T extends ZodRawShape>(s: z.ZodObject<T>) =>
  Object.entries(s.shape).reduce(
    (acc, [k, _]) =>
      ({
        ...acc,
        [k]: z.undefined(),
      } as const),
    {}
  );


export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never;
};

export type XOR<T, U> = T | U extends object
  ? Prettify<Without<T, U> & U> | Prettify<Without<U, T> & T>
  : T | U;
 */
type trashMedia = {
  MediaID: number;
  Title: string;
  Category: "Movie" | "TV";
  Rating: number;
  Popularity: number;
  Duration: string;
  Description: string;
  ReleaseYear: Date;
  AddedOn: Date;
  FileURL: string;
  PosterURL?: string | undefined;
};

type trashMediaSearchResult = {
  data: trashMedia[];
  // when the cursor is null, there are no more results
  cursor: number | null;
};

type trashURL = {
  category: "movies" | "tv";
  search?: string;
  cursor?: number;
  limit?: number;
  order?: "asc" | "desc" | "ASC" | "DESC";
  sort?: "trending" | "top";
};
// END TRASH

/**************** THE OLD SHIT ********************************/
export const BASE_URL = `https://api.themoviedb.org/3`;
export const KEY = `api_key=${process.env.TMDB_KEY}`;

export const IMAGE_URL = `https://image.tmdb.org/t/p/`;
export const IMAGE_URL_FULLRES = `${IMAGE_URL}original`;
export const IMAGE_URL_MEDRES = `${IMAGE_URL}w500`;
export const IMAGE_PlaceHolder = `${IMAGE_URL}w600_and_h900_bestv2/uc4RAVW1T3T29h6OQdr7zu4Blui.jpg`;

// export const full_res_image =
//  (media: Tv | Movie | null | undefined) => media?.backdrop_path
//   ? IMAGE_URL_FULLRES + media.backdrop_path
//   : "/not-found.png"

export const trendingTv_URL = `${BASE_URL}/trending/tv/day?${KEY}&language=en-US`;
export const popularTv_URL = `${BASE_URL}/tv/popular?${KEY}&language=en-US`;
export const latestTv_URL = `${BASE_URL}/tv/latest?${KEY}&language=en-US`;
export const airingTodayTv_URL = `${BASE_URL}/tv/airing_today?${KEY}&language=en-US`;
export const topRatedTv_URL = `${BASE_URL}/tv/top_rated?${KEY}&language=en-US`;
export const onTheAirTv_URL = `${BASE_URL}/tv/on_the_air?${KEY}&language=en-US`;
export const searchTv_URL = `${BASE_URL}/search/tv?${KEY}&query=`;

export const trendingMovies_URL = `${BASE_URL}/trending/movie/day?${KEY}&language=en-US`;
export const popularMovies_URL = `${BASE_URL}/movie/popular?${KEY}&language=en-US`;
export const latestMovies_URL = `${BASE_URL}/movie/latest?${KEY}&language=en-US`;
export const upcomingMovies_URL = `${BASE_URL}/movie/upcoming?${KEY}&language=en-US`;
export const topRatedMovies_URL = `${BASE_URL}/movie/top_rated?${KEY}&language=en-US`;
export const nowPlayingMovies_URL = `${BASE_URL}/movie/now_playing?${KEY}&language=en-US`;
export const searchMovies_URL = `${BASE_URL}/search/movie?${KEY}&query=`;

export type Genre = {
  id: number;
  name: string;
};

export type Video = {
  name?: string;
  key?: string;
  site?: string;
  type?: string;
};

export type Movie = {
  title: string;
  backdrop_path: string;
  media_type?: string;
  release_date?: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
};

export type Tv = {
  title: string;
  backdrop_path: string;
  media_type?: string;
  release_date?: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
};

export type Element = {
  type:
    | "Bloopers"
    | "Featurette"
    | "Behind the Scenes"
    | "Clip"
    | "Trailer"
    | "Teaser";
};

export const countries = {
  AD: "Andorra",
  AE: "United Arab Emirates",
  AF: "Afghanistan",
  AG: "Antigua and Barbuda",
  AI: "Anguilla",
  AL: "Albania",
  AM: "Armenia",
  AN: "Netherlands Antilles",
  AO: "Angola",
  AQ: "Antarctica",
  AR: "Argentina",
  AS: "American Samoa",
  AT: "Austria",
  AU: "Australia",
  AW: "Aruba",
  AZ: "Azerbaijan",
  BA: "Bosnia and Herzegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgium",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrain",
  BI: "Burundi",
  BJ: "Benin",
  BM: "Bermuda",
  BN: "Brunei Darussalam",
  BO: "Bolivia",
  BR: "Brazil",
  BS: "Bahamas",
  BT: "Bhutan",
  BU: "Burma",
  BV: "Bouvet Island",
  BW: "Botswana",
  BY: "Belarus",
  BZ: "Belize",
  CA: "Canada",
  CC: "Cocos  Islands",
  CD: "Congo",
  CF: "Central African Republic",
  CG: "Congo",
  CH: "Switzerland",
  CI: "Cote D'Ivoire",
  CK: "Cook Islands",
  CL: "Chile",
  CM: "Cameroon",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  CS: "Serbia and Montenegro",
  CU: "Cuba",
  CV: "Cape Verde",
  CX: "Christmas Island",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DE: "Germany",
  DJ: "Djibouti",
  DK: "Denmark",
  DM: "Dominica",
  DO: "Dominican Republic",
  DZ: "Algeria",
  EC: "Ecuador",
  EE: "Estonia",
  EG: "Egypt",
  EH: "Western Sahara",
  ER: "Eritrea",
  ES: "Spain",
  ET: "Ethiopia",
  FI: "Finland",
  FJ: "Fiji",
  FK: "Falkland Islands",
  FM: "Micronesia",
  FO: "Faeroe Islands",
  FR: "France",
  GA: "Gabon",
  GB: "United Kingdom",
  GD: "Grenada",
  GE: "Georgia",
  GF: "French Guiana",
  GH: "Ghana",
  GI: "Gibraltar",
  GL: "Greenland",
  GM: "Gambia",
  GN: "Guinea",
  GP: "Guadaloupe",
  GQ: "Equatorial Guinea",
  GR: "Greece",
  GS: "South Georgia and the South Sandwich Islands",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HK: "Hong Kong",
  HM: "Heard and McDonald Islands",
  HN: "Honduras",
  HR: "Croatia",
  HT: "Haiti",
  HU: "Hungary",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IN: "India",
  IO: "British Indian Ocean Territory",
  IQ: "Iraq",
  IR: "Iran",
  IS: "Iceland",
  IT: "Italy",
  JM: "Jamaica",
  JO: "Jordan",
  JP: "Japan",
  KE: "Kenya",
  KG: "Kyrgyz Republic",
  KH: "Cambodia",
  KI: "Kiribati",
  KM: "Comoros",
  KN: "St. Kitts and Nevis",
  KP: "North Korea",
  KR: "South Korea",
  KW: "Kuwait",
  KY: "Cayman Islands",
  KZ: "Kazakhstan",
  LA: "Lao People's Democratic Republic",
  LB: "Lebanon",
  LC: "St. Lucia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberia",
  LS: "Lesotho",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  LY: "Libyan Arab Jamahiriya",
  MA: "Morocco",
  MC: "Monaco",
  MD: "Moldova",
  ME: "Montenegro",
  MG: "Madagascar",
  MH: "Marshall Islands",
  MK: "Macedonia",
  ML: "Mali",
  MM: "Myanmar",
  MN: "Mongolia",
  MO: "Macao",
  MP: "Northern Mariana Islands",
  MQ: "Martinique",
  MR: "Mauritania",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldives",
  MW: "Malawi",
  MX: "Mexico",
  MY: "Malaysia",
  MZ: "Mozambique",
  NA: "Namibia",
  NC: "New Caledonia",
  NE: "Niger",
  NF: "Norfolk Island",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Netherlands",
  NO: "Norway",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "New Zealand",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "French Polynesia",
  PG: "Papua New Guinea",
  PH: "Philippines",
  PK: "Pakistan",
  PL: "Poland",
  PM: "St. Pierre and Miquelon",
  PN: "Pitcairn Island",
  PR: "Puerto Rico",
  PS: "Palestinian Territory",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Romania",
  RS: "Serbia",
  RU: "Russia",
  RW: "Rwanda",
  SA: "Saudi Arabia",
  SB: "Solomon Islands",
  SC: "Seychelles",
  SD: "Sudan",
  SE: "Sweden",
  SG: "Singapore",
  SH: "St. Helena",
  SI: "Slovenia",
  SJ: "Svalbard & Jan Mayen Islands",
  SK: "Slovakia",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalia",
  SR: "Suriname",
  SS: "South Sudan",
  ST: "Sao Tome and Principe",
  SU: "Soviet Union",
  SV: "El Salvador",
  SY: "Syrian Arab Republic",
  SZ: "Swaziland",
  TC: "Turks and Caicos Islands",
  TD: "Chad",
  TF: "French Southern Territories",
  TG: "Togo",
  TH: "Thailand",
  TJ: "Tajikistan",
  TK: "Tokelau",
  TL: "Timor-Leste",
  TM: "Turkmenistan",
  TN: "Tunisia",
  TO: "Tonga",
  TP: "East Timor",
  TR: "Turkey",
  TT: "Trinidad and Tobago",
  TV: "Tuvalu",
  TW: "Taiwan",
  TZ: "Tanzania",
  UA: "Ukraine",
  UG: "Uganda",
  UM: "United States Minor Outlying Islands",
  US: "United States of America",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VA: "Holy See",
  VC: "St. Vincent and the Grenadines",
  VE: "Venezuela",
  VG: "British Virgin Islands",
  VI: "US Virgin Islands",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis and Futuna Islands",
  WS: "Samoa",
  XC: "Czechoslovakia",
  XG: "East Germany",
  XI: "Northern Ireland",
  XK: "Kosovo",
  YE: "Yemen",
  YT: "Mayotte",
  YU: "Yugoslavia",
  ZA: "South Africa",
  ZM: "Zambia",
  ZR: "Zaire",
  ZW: "Zimbabwe",
} as const;
