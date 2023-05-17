"use client";
import { useState } from "react";
import { countries, trace } from "~/utils";
import { updateUser } from "~/lib/user";
import { createUserCookie } from "~/lib/client-cookie";
import { User } from "@e7na/api-spec";

export function Form({ userDetails }: { userDetails: User }) {
  const [country, setCountry] = useState({
    code: "",
  });

  const handleSubmit = async (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const user = await updateUser({
      UserID: (await userDetails).UserID!,
      CountryID: country.code,
    })
      .then((res) => res?.json())
      .then((res) => !!res && User.parse(res));

    if (!user) {
      console.error("profile creation failed");
      return;
    }

    await createUserCookie(user);
    window.location.href = "/";
  };

  return (
    <form
      onSubmit={(event) => handleSubmit(event)}
      className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
    >
      <h1 className="text-4xl font-semibold text-white">Add Country</h1>
      <div className="space-y-4">
        <label className="inline-block w-full">
          <select
            id="country"
            name="country"
            className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
            onChange={(event) => setCountry({ code: event.target.value })}
          >
            <option value="">Select country</option>
            {Object.entries(countries).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <button
          className="w-full rounded bg-[#E50914] py-3 font-semibold"
          type="submit"
          onClick={(event) => handleSubmit(event)}
        >
          Sign In
        </button>
      </div>
    </form>
  );
}
