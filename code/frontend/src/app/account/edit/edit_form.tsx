"use client";
import { useState } from "react";
import { countries, trace } from "~/utils";
import { getUser, updateUser } from "~/lib/user";
import { User } from "@e7na/api-spec";
import { createUserCookie } from "~/lib/client-cookie";

export default function EditForm({ userData }: { userData: User }) {
  const [formData, setFormData] = useState({
    email: userData.Email ?? "",
    address: userData.Address ?? "",
    gender: userData.Gender ?? "",
    countryid: userData.CountryID ?? "",
    fname: userData.FirstName ?? "",
    lname: userData.LastName ?? "",
    phone: userData.PhoneNumber ?? "",
  });

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await updateUser({
      UserID: userData.UserID!,
      FirstName:
        formData.fname == userData.FirstName ? undefined : formData.fname,
      LastName:
        formData.lname == userData.LastName ? undefined : formData.lname,
      Gender:
        formData.gender == userData.Gender
          ? undefined
          : (formData.gender as "Male") || "Female",
      Email: formData.email == userData.Email ? undefined : formData.email,
      Address:
        formData.address == userData.Address ? undefined : formData.address,
      CountryID:
        formData.countryid == userData.CountryID
          ? undefined
          : formData.countryid,
      PhoneNumber:
        formData.phone == userData.PhoneNumber ? undefined : formData.phone,
    });
    const user = await getUser()
      .then((res) => res.json())
      .then((res) => User.parse(res));
    await createUserCookie(user);
    window.location.href = "/";
  };
  return (
    <form
      onSubmit={(event) => handleSubmit(event)}
      className="relative mt-24 space-y-5 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
    >
      <h1 className="text-4xl font-semibold text-white">
        Edit {userData.FirstName || "sadge"}'s Info
      </h1>
      <div className="space-y-4">
        <label className="inline-block w-full">
          <input
            type="text"
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            placeholder="First Name"
            className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
          />
        </label>
        <label className="inline-block w-full">
          <input
            type="text"
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            placeholder="Last Name"
            className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
          />
        </label>
        <label className="inline-block w-full">
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label className="inline-block w-full">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
          />
        </label>
        <label className="inline-block w-full">
          <input
            type="address"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
          />
        </label>
        <label className="inline-block w-full">
          <select
            id="countryid"
            name="countryid"
            value={formData.countryid}
            onChange={handleChange}
            className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
          >
            <option value="">Select country</option>
            {Object.entries(countries).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-block w-full">
          <input
            type="phone"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
          />
        </label>
      </div>
      <button
        className="w-full rounded bg-[#E50914] py-3 font-semibold"
        type="submit"
        onClick={(event) => handleSubmit(event)}
      >
        Submit
      </button>
    </form>
  );
}
