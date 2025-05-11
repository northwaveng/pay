"use client";

import { AddCircle, ArrowDown2, ArrowUp2, Trash } from "iconsax-react";
import SearchDva from "@/app/_components/dvas/search_dva";
import { truncate } from "@/app/_utils/truncate";
import capitalize from "@/app/_utils/capitalize";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import Loader from "@/app/_components/loader";
import { formatTimestamp } from "@/app/_utils/format_timestamp";
import getFieldName from "@/app/_utils/get_field_name";
import { useMediaQuery } from "@chakra-ui/react";

const Dva = ({ selectedDva, newDva }) => {
  const [isMobile] = useMediaQuery("(max-width: 576px)");
  const [isLoadingDva, setIsLoadingDva] = useState(true);
  const [dvas, setDvas] = useState([]);
  const [totalDvas, setTotalDvas] = useState(0);
  const [sortedDvas, setSortedDvas] = useState([]);
  const [sortingBtn, setSortingBtn] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "dvas"), orderBy("createdOn", "desc")),
      (snap) => {
        setIsLoadingDva(false);
        setDvas(snap.docs.map((doc) => doc.data()));
        setTotalDvas(snap.size);
      }
    );

    return () => unsubscribe();
  }, []);

  const changeSortingDva = (field, isAsc) => {
    const dataToSort = sortedDvas.length > 0 ? [...sortedDvas] : [...dvas];

    const sorted = dataToSort.sort((_a, _b) => {
      const a = getFieldName(_a, field);
      const b = getFieldName(_b, field);

      return isAsc ? a - b : b - a;
    });

    setSortedDvas(sorted);
    setSortingBtn(`${field}${isAsc}`);
  };

  const renderTableRow = (dva, index) => (
    <tr key={index} className="pe-active" onClick={() => selectedDva(dva)}>
      <td className="align-middle">
        {capitalize(truncate(dva.accountName, 30))}
      </td>
      <td className="align-middle">{capitalize(dva.accountNumber)}</td>
      <td className="align-middle">{capitalize(dva.bankName)}</td>
      <td className="align-middle">{formatTimestamp(dva.createdOn)}</td>
    </tr>
  );

  const handleSelectedDva = (dva) => selectedDva(dva);

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className={`col-md-12 ${
            isMobile ? "pt-4" : "p-4"
          } pb-0 dash-header-normal`}
        >
          <div
            className={`my-2 d-flex justify-content-between ${
              isMobile ? "flex-column" : "align-items-center"
            }`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="fw-semibold m-0">Dva</h4>
              <small className="badge fw-normal py-1 px-2 m-0 rounded-1 alert alert-primary ms-2">
                {totalDvas}
              </small>
            </div>

            <div className={`d-flex ${isMobile ? "mt-3 flex-column" : ""}`}>
              <SearchDva selectedSearchDva={handleSelectedDva} />

              <button
                onClick={() => newDva(true)}
                className={`btn-dash btn-primary border-0 ${
                  isMobile ? "mt-2 w-100" : ""
                }`}
              >
                <AddCircle size={20} />
                New Dva
              </button>
            </div>
          </div>

          <hr className="mb-0" />
        </div>

        {isLoadingDva && dvas.length === 0 && (
          <div className="col-md-12 dash-body-normal d-flex justify-content-center">
            <Loader />
          </div>
        )}

        {!isLoadingDva && dvas.length === 0 && (
          <div className="col-md-12 dash-body-normal text-muted text-center">
            <Trash size={100} variant="Bold" />
            <p className="mt-4 mb-0">No dvas yet</p>
          </div>
        )}

        {!isLoadingDva && dvas.length > 0 && (
          <div className="col-md-12 dash-body-normal px-4 py-0 pb-5">
            <div className="table-responsive ">
              <table className="table table-hover">
                <thead>
                  <tr className="thead-dash">
                    <th scope="col">
                      <div className="d-flex align-items-center">
                        Account Name
                        <div className="d-flex flex-column ms-1">
                          <ArrowUp2
                            size={12}
                            onClick={() =>
                              changeSortingDva("accountName", true)
                            }
                            className={
                              sortingBtn === `name${true}`
                                ? "text-text pe-active"
                                : "text-muted pe-active"
                            }
                          />
                          <ArrowDown2
                            size={12}
                            onClick={() =>
                              changeSortingDva("accountName", false)
                            }
                            className={
                              sortingBtn === `name${false}`
                                ? "text-text pe-active"
                                : "text-muted pe-active"
                            }
                          />
                        </div>
                      </div>
                    </th>
                    <th scope="col">Account Number</th>
                    <th scope="col">Bank Name</th>
                    <th scope="col">
                      <div className="d-flex align-items-center">
                        Created On
                        <div className="d-flex flex-column ms-1">
                          <ArrowUp2
                            size={12}
                            onClick={() => changeSortingDva("createdOn", true)}
                            className={
                              sortingBtn === `createdOn${true}`
                                ? "text-text pe-active"
                                : "text-muted pe-active"
                            }
                          />
                          <ArrowDown2
                            size={12}
                            onClick={() => changeSortingDva("createdOn", false)}
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
                  {(sortedDvas.length > 0 ? sortedDvas : dvas).map(
                    (dva, index) => renderTableRow(dva, index)
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dva;
