"use client";

import { AddCircle, ArrowDown2, ArrowUp2, Trash } from "iconsax-react";
import SearchTo from "@/app/_components/to/search_to";
import { truncate } from "@/app/_utils/truncate";
import capitalize from "@/app/_utils/capitalize";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import Loader from "@/app/_components/loader";
import { formatTimestamp } from "@/app/_utils/format_timestamp";
import getFieldName from "@/app/_utils/get_field_name";
import { useMediaQuery } from "@chakra-ui/react";

const To = ({ selectedTo, newTo }) => {
  const [isMobile] = useMediaQuery("(max-width: 576px)");
  const [isLoadingTo, setIsLoadingTo] = useState(true);
  const [tos, setTos] = useState([]);
  const [totalTos, setTotalTos] = useState(0);
  const [sortedTos, setSortedTos] = useState([]);
  const [sortingBtn, setSortingBtn] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users"),
        where("isTaxOfficer", "==", true),
        orderBy("createdOn", "desc")
      ),
      (snap) => {
        setIsLoadingTo(false);
        setTos(snap.docs.map((doc) => doc.data()));
        setTotalTos(snap.size);
      }
    );

    return () => unsubscribe();
  }, []);

  const changeSortingTo = (field, isAsc) => {
    const dataToSort = sortedTos.length > 0 ? [...sortedTos] : [...tos];

    const sorted = dataToSort.sort((_a, _b) => {
      const a = getFieldName(_a, field);
      const b = getFieldName(_b, field);

      return isAsc ? a - b : b - a;
    });

    setSortedTos(sorted);
    setSortingBtn(`${field}${isAsc}`);
  };

  const renderTableRow = (to, index) => (
    <tr key={index} className="pe-active" onClick={() => selectedTo(to)}>
      <td className="align-middle">
        {!to.hasPassword && (
          <span className="badge text-bg-primary me-2"> </span>
        )}
        {capitalize(truncate(to.name, 30))}
      </td>
      <td className="align-middle">{capitalize(to.phoneNumber)}</td>
      <td className="align-middle">{capitalize(to.location)}</td>
      <td className="align-middle">{truncate(to.email, 30)}</td>
      <td className="align-middle">{formatTimestamp(to.createdOn)}</td>
    </tr>
  );

  const handleSelectedTo = (to) => selectedTo(to);

  return (
    <div className="content overflow-none">
      <div className="container-fluid">
        <div className="row">
          <div
            className={`col-md-12 ${
              isMobile ? "pt-4" : "p-4"
            } pb-0 dash-header`}
          >
            <div
              className={`my-2 d-flex justify-content-between ${
                isMobile ? "flex-column" : "align-items-center"
              }`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-semibold m-0">Tax Officers</h4>
                <small className="badge fw-normal py-1 px-2 m-0 rounded-1 alert alert-primary ms-2">
                  {totalTos}
                </small>
              </div>

              <div className={`d-flex ${isMobile ? "mt-3 flex-column" : ""}`}>
                <SearchTo selectedSearchTo={handleSelectedTo} />

                <button
                  onClick={() => newTo(true)}
                  className={`btn-dash btn-primary border-0 ${
                    isMobile ? "mt-2 w-100" : ""
                  }`}
                >
                  <AddCircle size={20} />
                  New Tax Officer
                </button>
              </div>
            </div>

            <hr className="mb-0" />
          </div>

          {isLoadingTo && tos.length === 0 && (
            <div className="col-md-12 dash-body d-flex justify-content-center">
              <Loader />
            </div>
          )}

          {!isLoadingTo && tos.length === 0 && (
            <div className="col-md-12 dash-body text-muted text-center">
              <Trash size={100} variant="Bold" />
              <p className="mt-4 mb-0">No tax officers yet</p>
            </div>
          )}

          {!isLoadingTo && tos.length > 0 && (
            <div className="col-md-12 dash-body px-4 py-0 pb-5">
              <div className="table-responsive ">
                <table className="table table-hover">
                  <thead>
                    <tr className="thead-dash">
                      <th scope="col">
                        <div className="d-flex align-items-center">
                          Name
                          <div className="d-flex flex-column ms-1">
                            <ArrowUp2
                              size={12}
                              onClick={() => changeSortingTo("name", true)}
                              className={
                                sortingBtn === `name${true}`
                                  ? "text-text pe-active"
                                  : "text-muted pe-active"
                              }
                            />
                            <ArrowDown2
                              size={12}
                              onClick={() => changeSortingTo("name", false)}
                              className={
                                sortingBtn === `name${false}`
                                  ? "text-text pe-active"
                                  : "text-muted pe-active"
                              }
                            />
                          </div>
                        </div>
                      </th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Location</th>
                      <th scope="col">Email</th>
                      <th scope="col">
                        <div className="d-flex align-items-center">
                          Created On
                          <div className="d-flex flex-column ms-1">
                            <ArrowUp2
                              size={12}
                              onClick={() => changeSortingTo("createdOn", true)}
                              className={
                                sortingBtn === `createdOn${true}`
                                  ? "text-text pe-active"
                                  : "text-muted pe-active"
                              }
                            />
                            <ArrowDown2
                              size={12}
                              onClick={() =>
                                changeSortingTo("createdOn", false)
                              }
                              className={
                                sortingBtn === `createdOn${false}`
                                  ? "text-text pe-active"
                                  : "text-muted pe-active"
                              }
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {(sortedTos.length > 0 ? sortedTos : tos).map((to, index) =>
                      renderTableRow(to, index)
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default To;
