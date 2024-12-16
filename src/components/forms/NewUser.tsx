"use client";
import { axios } from "@/lib/axiosClient";
import { uploadFile } from "@/lib/fileUpload";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

const NewUserForm = () => {
  const [user, setUser] = useState<User>({
    name: "Tay JunJo",
    phoneNumber: "237654568346",
    email: "junjotay@gmail.com",
    gender: "Male",
    country: "Cameroon",
    dateOfBirth: {
      day: "12",
      month: "04",
      year: "2000",
    },
    avatar: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes("dateOfBirth")) {
      const [field, subField] = name.split(".");
      setUser((prev) => ({
        ...prev,
        [field]: {
          // @ts-ignore
          ...prev[field],
          [subField]: value,
        },
      }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    setPhoto(file || null);
    if (file) {
      try {
        const url = await uploadFile(file, "avatar");
        setUser({ ...user, avatar: url });
      } catch (error) {
        setErrors((prevError) => ({
          ...prevError,
          avatar: "Failed to upload avatar",
        }));
      }
    }
  };

  console.log(user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    try {
      const response = await axios
        .post("/user/register", user)
        .then(({ data }) => {
          setMessage("User created successfully!");
        })
        .catch(({ response }) => {
          // setError("Something went wrong!");
          console.log(response);
          if (response) {
            if (response.status === 409) {
              setErrors({ [response.data.field]: response.data.message });
            } else if (response.data && Array.isArray(response.data.errors)) {
              const errorArray: FieldError[] = response.data.errors;
              const newError: Record<string, string> = {};

              errorArray.forEach((error) => {
                const fieldName = error.path[0];
                newError[fieldName] = error.message;
              });
              setErrors(newError);
              console.log(newError);
            } else {
              console.error("Unexpected error:", response);
            }
          }
        });
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 409) {
          setErrors({ [err.response.data.field]: err.response.data.message });
        } else if (
          err.response.data &&
          Array.isArray(err.response.data.errors)
        ) {
          const newError: Record<string, string> = {};
          err.response.data.errors.forEach((error: any) => {
            newError[error.path[0]] = error.message;
          });
          setErrors(newError);
        } else {
          console.error("Unexpected error:", err.response);
        }
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create User</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row gap-3">
          <div className="mb-4 w-full">
            <label className="block text-gray-700">User Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            {errors.name && (
              <div className="mb-4 text-red-600">{errors.name}</div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <div className="mb-4 w-full">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            {errors.phoneNumber && (
              <div className="mb-4 text-red-600">{errors.phoneNumber}</div>
            )}
          </div>
          <div className="mb-4 w-full">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            {errors.email && (
              <div className="mb-4 text-red-600">{errors.email}</div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <div className="mb-4 w-full">
            <label className="block text-gray-700">Gender</label>
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <div className="mb-4 text-red-600">{errors.gender}</div>
            )}
          </div>
          <div className="mb-4 w-full">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={user.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            {errors.country && (
              <div className="mb-4 text-red-600">{errors.country}</div>
            )}
          </div>
        </div>
        <div className="flex flew-row gap-3">
          <div className="mb-4 w-2/3">
            <label className="block text-gray-700">Avatar</label>
            <input
              type="file"
              accept=""
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.avatar && (
              <div className="mb-4 text-red-600">{errors.avatar}</div>
            )}
          </div>
          <div className="w-1/3">
            {photo && (
              <Image
                src={`http://localhost:4020/public/uploads/avatars/${user.avatar}`}
                alt={user.name}
                width={100}
                height={100}
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth</label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="dateOfBirth.day"
              value={user.dateOfBirth.day}
              onChange={handleChange}
              placeholder="Day"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="dateOfBirth.month"
              value={user.dateOfBirth.month}
              onChange={handleChange}
              placeholder="Month"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="dateOfBirth.year"
              value={user.dateOfBirth.year}
              onChange={handleChange}
              placeholder="Year"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          {errors.dateOfBirth && (
            <div className="mb-4 text-red-600">{errors.dateOfBirth}</div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default NewUserForm;
