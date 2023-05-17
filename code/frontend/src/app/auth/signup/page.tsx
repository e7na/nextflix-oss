"use client";
import Image from "next/legacy/image";
import { useState } from "react";
import { signUp } from "~/lib/auth";
import { countries } from "~/utils";
import { createUserCookie } from "~/lib/client-cookie";
import { getUser } from "~/lib/user";
import { User } from "@e7na/api-spec";

function signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    address: "",
    gender: "",
    countryid: "",
    fname: "",
    lname: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    address: "",
    gender: "",
    countryid: "",
    fname: "",
    lname: "",
    phone: "",
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
    // perform form validation
    let errors: { [key: string]: string | Partial<FormData> } = {};
    // if (!formData.fname.trim()) {
    //   errors.fname = "First name is required";
    // }
    // if (!formData.lname.trim()) {
    //   errors.lname = 'Last name is required';
    // }
    // if (!formData.gender) {
    //   errors.gender = 'Gender is required';
    // }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }
    // else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   errors.email = 'Invalid email format';
    // }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 4) {
      errors.password = "Password must be at least 6 characters";
    }
    /*     if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!formData.countryid) {
      errors.countryid = 'Country is required';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else */ if (formData.phone && !/^\d{11}$/.test(formData.phone)) {
      errors.phone = "Invalid phone number format";
    }
    setFormErrors({ ...formErrors, ...errors });

    // submit the form if there are no errors
    if (Object.keys(errors).length === 0) {
      await signUp(formData as any);
      const user = await getUser()
        .then((res) => res.json())
        .then((res) => User.parse(res));
      await createUserCookie(user);

      window.location.href = "/";
    }
  };
  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <title>Sign Up</title>
      <Image
        src="https://assets.nflxext.com/ffe/siteui/vlv3/d0982892-13ac-4702-b9fa-87a410c1f2da/519e3d3a-1c8c-4fdb-8f8a-7eabdbe87056/AE-en-20220321-popsignuptwoweeks-perspective_alpha_website_large.jpg"
        className="-z-10 !hidden opacity-90 sm:!inline"
        layout="fill"
        objectFit="cover"
      />
      <img
        src="/logo.svg"
        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
        width={150}
        height={150}
      />

      <form
        onSubmit={(event) => handleSubmit(event)}
        className="relative mt-24 space-y-5 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl font-semibold text-white">Sign Up</h1>
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
            <p className="p-1 text-[13px] font-light  text-[#E50914]">
              {formErrors.fname}
            </p>
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
            <p className="p-1 text-[13px] font-light  text-[#E50914]">
              {formErrors.lname}
            </p>
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
            <p className="p-1 text-[13px] font-light  text-[#E50914]">
              {formErrors.gender}
            </p>
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
            <p className="p-1 text-[13px] font-light  text-[#E50914]">
              {formErrors.email}
            </p>
          </label>
          <label className="inline-block w-full">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className=" w-full rounded border-b-2 border-[#E50914] bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
            />
            <p className="p-1 text-[13px] font-light  text-[#E50914]">
              {formErrors.password}
            </p>
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
            <p className="p-1 text-[13px] font-light  text-[#E50914]">
              {formErrors.address}
            </p>
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
            <p className="p-1 text-[13px] font-light  text-[#E50914]">
              {formErrors.countryid}
            </p>
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
            <p className="p-1 text-[13px] font-light  text-[#E50914]">
              {formErrors.phone}
            </p>
          </label>
        </div>
        <button
          className="w-full rounded bg-[#E50914] py-3 font-semibold"
          type="submit"
          onClick={(event) => handleSubmit(event)}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default signup;
