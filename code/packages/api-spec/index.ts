import z from "zod";
export { z };

/******************* general helpers *******************/

export const ITEMS_PER_PAGE = 20;
export const API_BASE_URL =
  `http://localhost:${process.env.BACKEND_PORT}/api` as const;

export type infer<T extends z.ZodTypeAny> = z.output<T>;
export type input<T extends z.ZodTypeAny> = z.input<T>;
export function guardedParse<T extends z.ZodTypeAny>(
  parser: T,
  input: z.input<T>
): z.output<T> {
  const result = parser.safeParse(input);
  if (!result.success) {
    console.error(result.error);
    return;
  }
  return result.data;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type OnlyRequire<T, K extends keyof T> = Partial<T> & {
  [P in K]-?: T[P];
};

const DateStr = z.coerce.date().transform((input) => String(input));

/********************* DB schema *********************/

//prettier-ignore
export const GenreName = [
  'Action & Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Kids',
  'Mystery', 'News', 'Reality', 'Sci-Fi & Fantasy', 'Soap', 'War & Politics',
  'Talk', 'Western', 'Action', 'Adventure', 'Drama', 'Family', 'Fantasy',
  'History', 'Horror', 'Music', 'Romance', 'Science Fiction', 'TV Movie',
  'Thriller', 'War'
] as const;
export const Genre = z.object({
  GenreID: z.number().int(),
  GenreName: z.enum(GenreName),
});
export type Genre = z.output<typeof Genre>;

export const Company = z.object({
  CompanyID: z.number().int(),
  CompanyName: z.string().max(45).optional().nullable(),
});
export type Company = z.output<typeof Company>;

export const Media = z.object({
  MediaID: z.number().int(),
  Category: z.enum(["Movie", "TV"]),
  Title: z.string().max(150).min(1),
  PosterURL: z.string().optional().nullable(),
  BackdropURL: z.string().optional().nullable(),
  Description: z
    .string()
    .or(z.any().transform(() => "No description available")),
  ReleaseYear: DateStr.optional().nullable(),
  AddedOn: DateStr.optional().nullable(),
  Rating: z.number().min(0).max(100).default(0).optional().nullable(),
  Popularity: z.number().min(0).max(100).default(0).optional().nullable(),
  GenreName: Genre.shape.GenreName.optional().nullable(),
  CompanyName: Company.shape.CompanyName.optional().nullable(),
});
export type Media = z.output<typeof Media>;

export const Subscription = z.object({
  SubID: z.number().int(),
  SubName: z.string().min(1).max(30),
  SubPrice: z.number(),
  MaxResolution: z.string().optional(),
});
export type Subscription = z.output<typeof Subscription>;

export const Country = z.object({
  CountryID: z.string().length(2),
  CountryName: z.string().max(55),
});
export type Country = z.output<typeof Country>;

export const User = z.object({
  UserID: z.number().int(),
  FirstName: z.string().max(30),
  LastName: z.string().max(30).optional().nullable(),
  Gender: z.enum(["Male", "Female"]).optional().nullable(),
  Email: z.string().email().optional().nullable(),
  PasswordHash: z.string().max(50).optional(),
  Address: z.string().optional().nullable(),
  CountryID: Country.shape.CountryID.optional().nullable(),
  PhoneNumber: z.string().max(14).optional().nullable(),
  CreatedOn: z.coerce.date().optional().nullable(),
  SubID: Subscription.shape.SubID.optional().nullable(),
  SubDate: z.coerce.date().optional().nullable(),
  RefreshToken: z.string().optional(),
});

// they're optional in TS & not in Zod because the db will always fill them
// so no correct database response will ever have them as undefined
export type User = PartialBy<
  z.output<typeof User>,
  "UserID" | "CreatedOn" | "SubDate"
>;

/********************** router parsers (frontend common) **********************/

const commonParams = z.object({
  cursor: z.coerce
    .number()
    .int()
    .nullable()
    .or(z.any().transform(() => 0)),
  limit: z.coerce.number().int().default(20),
});

export const MediaSearchQuery = z
  .object({
    search: z.string().min(2).optional(),
    details: z.coerce.boolean().or(z.any().transform(() => false)),
    order: z.enum(["ASC", "DESC", "asc", "desc"]).default("DESC"),
  })
  .merge(commonParams);
export type MediaSearchQuery = z.output<typeof MediaSearchQuery>;

export const MediaSearchRoutes = z.object({
  category: z.enum(["movies", "tv", "all"]),
  sort: z.enum(["trending", "top"]).optional(),
});
export type MediaSearchRoutes = z.output<typeof MediaSearchRoutes>;

export const MediaByIDsQuery = z.object({
  ids: z
    .string()
    .transform((s) => s.split(",").map(Number)?.filter(Boolean).join(",")),
});
export type MediaByIDsQuery = z.output<typeof MediaByIDsQuery>;

/********************** unused data schema **********************/

export const PaymentForSubscription = z.object({
  PaymentID: z.number().int(),
  UserID: User.shape.UserID,
  SubID: Subscription.shape.SubID,
  PaidAmount: z.number(),
  PaymentDate: z.coerce.date(),
});
export type PaymentForSubscription = z.output<typeof PaymentForSubscription>;

export const CompanyHasMedia = z.object({
  CompanyID: Company.shape.CompanyID,
  MediaID: Media.shape.MediaID,
});

export const MediaInGenre = z.object({
  GenreID: Genre.shape.GenreID,
  MediaID: Media.shape.MediaID,
});
export type MediaInGenre = z.output<typeof MediaInGenre>;

export const Region = z.object({
  RegionID: z.number().int(),
  CountryID: Country.shape.CountryID,
});
export type Region = z.output<typeof Region>;

export const CompanyInRegion = z.object({
  CompanyID: Company.shape.CompanyID,
  CompanyRegion: Region.shape.RegionID,
});

/********************** trash **********************/

/* 
 // prettier-ignore
 export const MediaQuery = MediaSearchRoutes.extend({
   category: MediaSearchRoutes.shape.category.transform((input) => {
     switch (input) {
     case "tv": return "TV";
     case "movies": return "Movie";
     case "all": return "";
     }
   }),
   sort: MediaSearchRoutes.shape.sort.transform((input) => {
     switch (input) {
     case "trending": return "Popularity";
     case "top": return "Rating";
     }
   })
 }).and(MediaSearchQuery);
*/
