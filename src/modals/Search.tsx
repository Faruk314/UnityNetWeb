import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { User } from "../types/types";
import profileDefault from "../images/profile.jpg";

function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function debounced(...args: Parameters<T>) {
    const later = () => {
      timeoutId = null;
      func(...args);
    };
    clearTimeout(timeoutId!);
    timeoutId = setTimeout(later, wait) as ReturnType<typeof setTimeout>;
  };
}

interface Props {
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search = ({ setSearchOpen }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:7000/api/users/searchUsers?q=${encodeURIComponent(
          query
        )}`
      );

      setSearchResults(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length >= 2) {
      debouncedSearch(query);
    } else {
      setSearchSuggestions([]);
    }
  };

  useEffect(() => {
    window.addEventListener("click", () => {
      setSearchOpen(false);
    });
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/users/searchUsers?q=${encodeURIComponent(
            searchTerm
          )}`
        );
        setSearchSuggestions(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (searchTerm.length >= 2) {
      fetchSuggestions();
    }
  }, [searchTerm]);

  return (
    <div className="absolute top-0 left-[2rem] w-[15rem] h-[15rem] rounded-md p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-30 bg-white text-black">
      <input
        onClick={(e) => {
          e.stopPropagation();
          setSearchOpen(true);
        }}
        value={searchTerm}
        onChange={handleInputChange}
        type="text"
        className="bg-gray-100 rounded-full focus:outline-none text-black px-2 py-[0.5rem] w-full"
        placeholder="search social media"
      />
      {searchTerm.length > 0 && (
        <div
          onClick={() => navigate(`/search`)}
          className="flex items-center space-x-2 hover:bg-gray-100 hover:cursor-pointer p-2 rounded-md"
        >
          <span className="rounded-full bg-blue-500 text-white w-[2rem] h-[2rem] flex items-center justify-center">
            <AiOutlineSearch size={20} />
          </span>
          <span className="text-blue-500">Search {searchTerm}</span>
        </div>
      )}

      {searchSuggestions.map((suggestion) => (
        <div
          onClick={() => navigate(`/profile/${suggestion.id}`)}
          key={suggestion.id}
          className="flex items-center space-x-4 hover:bg-gray-100 p-1 rounded-md hover:cursor-pointer mt-2"
        >
          <img
            src={suggestion.image || profileDefault}
            alt=""
            className="w-[2.5rem] h-[2.5rem] rounded-full"
          />

          <div className="flex space-x-1 font-bold">
            <span>{suggestion.first_name}</span>
            <span>{suggestion.last_name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Search;
