import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authActions } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import profileDefault from "../images/profile.jpg";

const SearchPage = () => {
  const search = useAppSelector((state) => state.auth.searchResults);
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.auth.searchTerm);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        if (searchTerm) {
          const response = await axios.get(
            `http://localhost:7000/api/users/searchUsers?q=${encodeURIComponent(
              searchTerm
            )}`
          );
          dispatch(authActions.setSearchResults(response.data));
        }
      } catch (err) {
        console.log(err);
      }
    };

    handleSearch();
  }, [dispatch, searchTerm]);

  return (
    <section className="bg-gray-100 h-[100vh]">
      <Navbar />

      <div className="mx-auto flex flex-col space-y-6 py-10 items-center justify-center">
        {search.map((result) => (
          <div
            key={result.id}
            className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white md:w-[35rem] flex items-center space-x-2 px-4 py-5 rounded-md"
          >
            <Link to={`/profile/${result.id}`}>
              <img
                className="w-[3rem] h-[3rem] md:h-[4rem] md:w-[4rem] rounded-full border-2"
                src={result.image || profileDefault}
                alt=""
              />
            </Link>

            <div className="flex flex-col">
              <h2 className="font-bold">
                {result.first_name} {result.last_name}
              </h2>
              {result.city && (
                <span className="text-gray-400">City: {result.city}</span>
              )}
              {result.country && (
                <span className="text-gray-400">Country: {result.country}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SearchPage;
