import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import Navbar from "../components/Navbar";
import Confirmation from "../modals/Confirmation";
import { useAppSelector } from "../redux/hooks";

const EditProfile = () => {
  const [succesModalOpen, setSuccesModalOpen] = useState(false);

  const [msg, setMsg] = useState("");
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [options, setOptions] = useState([
    {
      id: 1,
      desc: "First name",
      enabled: false,
      value: "",
    },
    {
      id: 2,
      desc: "Last name",
      enabled: false,
      value: "",
    },
    {
      id: 3,
      desc: "Country",
      enabled: false,
      value: "",
    },
    { id: 4, desc: "City", enabled: false, value: "" },
  ]);

  useEffect(() => {
    if (loggedUserInfo) {
      setOptions((prevOptions) =>
        prevOptions.map((option) => {
          switch (option.desc) {
            case "First name":
              return { ...option, value: loggedUserInfo.first_name || "" };
            case "Last name":
              return { ...option, value: loggedUserInfo.last_name || "" };
            case "Country":
              return { ...option, value: loggedUserInfo.country || "" };
            case "City":
              return { ...option, value: loggedUserInfo.city || "" };
            default:
              return option;
          }
        })
      );
    }
  }, [loggedUserInfo]);

  const handleClick = (id: number) => {
    const optionIndex = options.findIndex((option) => option.id === id);

    if (optionIndex !== -1) {
      const newOptions = [...options];

      newOptions[optionIndex].enabled = !newOptions[optionIndex].enabled;

      setOptions(newOptions);
    }
  };

  const handleConfirm = async () => {
    if (options[0].value.length === 0 || options[1].value.length === 0) {
      setMsg("First name or last name have to be included");
      return;
    }

    try {
      await axios.put("http://localhost:7000/api/users/editUserInfo", {
        firstName: options[0].value,
        lastName: options[1].value,
        country: options[2].value,
        city: options[3].value,
      });

      setSuccesModalOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="mx-4">
        <div className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] mx-auto mt-20 max-w-3xl px-4">
          <div className="py-2 text-2xl font-bold text-center border-b">
            Edit Profile
          </div>
          <div className="p-4 text-gray-500">
            {options.map((option, index) => (
              <div key={option.id} className="">
                <span className="block mt-2">{option.desc}</span>
                <div className="flex items-center space-x-2">
                  <input
                    onChange={(event) => {
                      const inputValue = event.target.value;
                      setOptions((prevOptions) =>
                        prevOptions.map((prevOption) =>
                          prevOption.id === option.id
                            ? { ...prevOption, value: inputValue }
                            : prevOption
                        )
                      );
                    }}
                    defaultValue={option.value}
                    style={
                      option.enabled ? { border: "1px solid #3b82f6" } : {}
                    }
                    disabled={option.enabled === false ? true : false}
                    className="w-full px-3 py-2 bg-gray-100 rounded-md outline-none"
                    placeholder=""
                  />

                  <button onClick={() => handleClick(option.id)}>
                    <AiFillEdit
                      size={20}
                      style={
                        option.enabled
                          ? { color: "#3b82f6" }
                          : { color: "black" }
                      }
                    />
                  </button>
                </div>
              </div>
            ))}

            {msg && <p className="mt-2 text-red-500">{msg}</p>}

            <button
              onClick={handleConfirm}
              disabled={
                options.some((option) => option.enabled === true) && true
              }
              className="p-2 mt-4 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-200"
            >
              Confirm
            </button>
          </div>
        </div>
        {succesModalOpen && (
          <Confirmation
            message={"Your profile has been successfully updated"}
            setOpen={setSuccesModalOpen}
          />
        )}
      </div>
    </>
  );
};

export default EditProfile;
