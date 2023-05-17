import { User, OnlyRequire } from "@e7na/api-spec";
import connection from "../db/db_connector.js";
// import { User } from "../utils/types.js";

export const getAllUsers = async () => {
  const users: User[] = (await connection
    .execute("select * from User", [])
    .then(([rows, fields]) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
    })) as User[];

  // console.log(users);
  return users;
};

export const getUserById = async (id: number) => {
  const users: User[] = (await connection
    .execute("select * from User where `UserID` = ? LIMIT 1", [id.toString()])
    .then(([rows, fields]) => {
      return rows;
    })) as User[];
  return users[0];
};

export const findUserByEmail = async (email: string) => {
  const users: User[] = (await connection
    .execute("select * from User where `Email` = ? LIMIT 1", [email])
    .then(([rows, fields]) => {
      return rows;
    })) as User[];
  return users[0];
};

export const findUserByName = async (name: string) => {
  const users: User[] = (await connection
    .execute("select * from User where `FirstName` = ? LIMIT 1", [name])
    .then(([rows, fields]) => {
      return rows;
    })) as User[];
  return users[0];
};

export const createUser = async (user: User) => {
  const successFlag: boolean = (await connection
    .execute(
      "INSERT INTO User (FirstName,Email,LastName,Gender,PasswordHash,Address,CountryID,PhoneNumber) VALUES (?,?,?,?,?,?,?,?)",
      [
        user.FirstName,
        user.Email,
        user.LastName || null,
        user.Gender || "Male",
        user.PasswordHash || null,
        user.Address || null,
        user.CountryID || null,
        user.PhoneNumber || null,
      ]
    )
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    })) as boolean;
  if (successFlag) return findUserByEmail(user.Email!);
};

export const updateRefreshToken = async (id: number, token: string | null) => {
  const successFlag: boolean = (await connection
    .execute("UPDATE User SET `RefreshToken` = ? WHERE `UserID`=?;", [
      token,
      id,
    ])
    .then(() => true)
    .catch((err) => {
      console.log(err);
      return false;
    })) as boolean;
  return successFlag;
};

export const getRefreshToken = async (token: string) => {
  const [{ RefreshToken: refreshToken }] = (await connection
    .execute("select `RefreshToken` from User where `RefreshToken`=? limit 1", [
      token,
    ])
    .then(([rows, fields]) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
      return { refreshToken: undefined };
    })) as [{ RefreshToken: string }];
  return { refreshToken };
};

export const updateUserByID = async (user: OnlyRequire<User, "UserID">) => {
  const [fields] = (await connection.execute(
    "UPDATE User SET" +
      Object.keys(user)
        .map((key) =>
          !!key && key !== "UserID" ? ` ${key}=:${key}` : undefined
        )
        .filter(Boolean)
        .join(",") +
      " WHERE UserID=:UserID",
    user
  )) as unknown as [{ affectedRows: number }];

  return fields.affectedRows === 1;
};
