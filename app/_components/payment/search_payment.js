"use client";

import { useRef, useState } from "react";
import { db } from "@/app/_components/firebase/fire_config";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Trash } from "iconsax-react";
import { truncate } from "@/app/_utils/truncate";
import capitalize from "@/app/_utils/capitalize";
import { useMediaQuery } from "@chakra-ui/react";

const SearchPayment = ({ selectedSearchPayment }) => {
  const [isMobile] = useMediaQuery("(max-width: 576px)");
  const [searchQ, setSearchQ] = useState("");
  const [searchR, setSearchR] = useState([]);
  const searchRef = useRef(null);

  const onSearch = async (e) => {
    const value = e.target.value;
    setSearchQ(value);

    if (value.length > 0) {
      // Query for transID
      const transIDQuery = query(
        collection(db, "transactions"),
        where("transID", ">=", value.toLowerCase()),
        where("transID", "<=", value.toLowerCase() + "\uf8ff"),
        orderBy("transID"),
        limit(10)
      );

      // Query for holder
      const holderQuery = query(
        collection(db, "transactions"),
        where("holder", ">=", value.toUpperCase()),
        where("holder", "<=", value.toUpperCase() + "\uf8ff"),
        orderBy("holder"),
        limit(10)
      );

      const transIDSnapshot = await getDocs(transIDQuery);
      const holderSnapshot = await getDocs(holderQuery);

      const transIDResults = transIDSnapshot.docs.map((doc) => doc.data());
      const holderResults = holderSnapshot.docs.map((doc) => doc.data());

      const combinedResults = [...transIDResults, ...holderResults].reduce(
        (acc, curr) => {
          if (!acc.some((doc) => doc.id === curr.id)) {
            acc.push(curr);
          }
          return acc;
        },
        []
      );

      setSearchR(combinedResults);
    } else {
      setSearchR([]);
    }
  };

  return (
    <div className="d-flex position-relative">
      <input
        type="search"
        className={`cus-form-control search-dash border ${
          isMobile ? "" : "me-4"
        }`}
        id="searchQ"
        placeholder="search by ID or Name"
        ref={searchRef}
        onChange={onSearch}
        onPaste={onSearch}
      />

      {searchR.length > 0 && searchQ.length > 0 && (
        <div className="container search-dash-result">
          <div className="row justify-content-center">
            <div className="col-md-12 p-0 m-0 bg-white text-center text-muted">
              <div className="border p-2 rounded-2 shadow-sm">
                <ul className="list-unstyled mb-0">
                  {searchR.map((result, index) => (
                    <li
                      key={index}
                      className={`d-flex justify-content-between text-start ${
                        searchR.length > 1 &&
                        index + 1 !== searchR.length &&
                        "mb-2"
                      }`}
                    >
                      {truncate(result.transID, 15)}

                      <button
                        onClick={() => {
                          selectedSearchPayment(result);
                          searchRef.current.value = "";
                          setSearchQ("");
                        }}
                        className="btn-dash-sm btn-primary py-0 px-2 border border-primary rounded-1"
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {searchR.length == 0 && searchQ.length > 0 && (
        <div className="container search-dash-result">
          <div className="row justify-content-center">
            <div className="col-md-12 p-0 m-0 bg-white text-center text-muted">
              <div className="border p-2 rounded-2 shadow-sm">
                <Trash size={30} />
                <p className="m-0 mt-2">No result</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPayment;
