"use client";

import { AddCircle, ArrowDown2, ArrowUp2, Trash } from "iconsax-react";
import SearchTp from "@/app/_components/dashboard/tp/search_tp";
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

const Tp = ({ selectedTp, newTp }) => {
  const [isMobile] = useMediaQuery("(max-width: 576px)");
  const [isLoadingTp, setIsLoadingTp] = useState(true);
  const [tps, setTps] = useState([]);
  const [totalTps, setTotalTps] = useState(0);
  const [sortedTps, setSortedTps] = useState([]);
  const [sortingBtn, setSortingBtn] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users"),
        where("isTaxPayer", "==", true),
        orderBy("createdOn")
      ),
      (snap) => {
        setIsLoadingTp(false);
        setTps(snap.docs.map((doc) => doc.data()));
        setTotalTps(snap.size);
      }
    );

    return () => unsubscribe();
  }, []);

  const changeSortingTp = (field, isAsc) => {
    const dataTpSort = sortedTps.length > 0 ? [...sortedTps] : [...tps];

    const sorted = dataTpSort.sort((_a, _b) => {
      const a = getFieldName(_a, field);
      const b = getFieldName(_b, field);

      return isAsc ? a - b : b - a;
    });

    setSortedTps(sorted);
    setSortingBtn(`${field}${isAsc}`);
  };

  const renderTableRow = (tp, index) => (
    <tr key={index} className="pe-active" onClick={() => selectedTp(tp)}>
      <td className="align-middle">{capitalize(truncate(tp.name, 30))}</td>
      <td className="align-middle">{capitalize(tp.phoneNumber)}</td>
      <td className="align-middle">{capitalize(tp.lga)}</td>
      <td className="align-middle">{truncate(tp.location, 30)}</td>
      <td className="align-middle">{formatTimestamp(tp.createdOn)}</td>
    </tr>
  );

  const handleSelectedTp = (tp) => selectedTp(tp);

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
                <h4 className="fw-semibold m-0">Tax Payers</h4>
                <small className="badge fw-normal py-1 px-2 m-0 rounded-1 alert alert-primary ms-2">
                  {totalTps}
                </small>
              </div>

              <div className={`d-flex ${isMobile ? "mt-3 flex-column" : ""}`}>
                <SearchTp selectedSearchTp={handleSelectedTp} />

                <button
                  onClick={() => newTp(true)}
                  className={`btn-dash btn-primary border-0 ${
                    isMobile ? "mt-2 w-100" : ""
                  }`}
                >
                  <AddCircle size={20} />
                  New Tax Payer
                </button>
              </div>
            </div>

            <hr className="mb-0" />
          </div>

          {isLoadingTp && tps.length === 0 && (
            <div className="col-md-12 dash-body d-flex justify-content-center">
              <Loader />
            </div>
          )}

          {!isLoadingTp && tps.length === 0 && (
            <div className="col-md-12 dash-body text-muted text-center">
              <Trash size={100} variant="Bold" />
              <p className="mt-4 mb-0">No tax payers yet</p>
            </div>
          )}

          {!isLoadingTp && tps.length > 0 && (
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
                              onClick={() => changeSortingTp("name", true)}
                              className={
                                sortingBtn === `name${true}`
                                  ? "text-text pe-active"
                                  : "text-muted pe-active"
                              }
                            />
                            <ArrowDown2
                              size={12}
                              onClick={() => changeSortingTp("name", false)}
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
                      <th scope="col">LGA</th>
                      <th scope="col">Address</th>
                      <th scope="col">
                        <div className="d-flex align-items-center">
                          Created On
                          <div className="d-flex flex-column ms-1">
                            <ArrowUp2
                              size={12}
                              onClick={() => changeSortingTp("createdOn", true)}
                              className={
                                sortingBtn === `createdOn${true}`
                                  ? "text-text pe-active"
                                  : "text-muted pe-active"
                              }
                            />
                            <ArrowDown2
                              size={12}
                              onClick={() =>
                                changeSortingTp("createdOn", false)
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
                    {(sortedTps.length > 0 ? sortedTps : tps).map((tp, index) =>
                      renderTableRow(tp, index)
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

export default Tp;
