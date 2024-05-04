"use client";

import { AddCircle, ArrowDown2, ArrowUp2, Trash } from "iconsax-react";
import SearchInsurance from "@/app/_components/insurance/search_insurance";
import { truncate } from "@/app/_utils/truncate";
import capitalize from "@/app/_utils/capitalize";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import Loader from "@/app/_components/loader";
import { formatTimestamp } from "@/app/_utils/format_timestamp";
import getFieldName from "@/app/_utils/get_field_name";
import { useMediaQuery } from "@chakra-ui/react";

const Insurance = ({ selectedInsurance, newInsurance }) => {
  const [isMobile] = useMediaQuery("(max-width: 576px)");
  const [isLoadingInsurance, setIsLoadingInsurance] = useState(true);
  const [insurances, setInsurances] = useState([]);
  const [totalInsurances, setTotalInsurances] = useState(0);
  const [sortedInsurances, setSortedInsurances] = useState([]);
  const [sortingBtn, setSortingBtn] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "insurances"), orderBy("createdOn", "desc")),
      (snap) => {
        setIsLoadingInsurance(false);
        setInsurances(snap.docs.map((doc) => doc.data()));
        setTotalInsurances(snap.size);
      }
    );

    return () => unsubscribe();
  }, []);

  const changeSortingInsurance = (field, isAsc) => {
    const dataToSort =
      sortedInsurances.length > 0 ? [...sortedInsurances] : [...insurances];

    const sorted = dataToSort.sort((_a, _b) => {
      const a = getFieldName(_a, field);
      const b = getFieldName(_b, field);

      return isAsc ? a - b : b - a;
    });

    setSortedInsurances(sorted);
    setSortingBtn(`${field}${isAsc}`);
  };

  const renderTableRow = (insure, index) => (
    <tr
      key={index}
      className="pe-active"
      onClick={() => selectedInsurance(insure)}
    >
      <td className="align-middle">{capitalize(truncate(insure.name, 30))}</td>
      <td className="align-middle">{capitalize(insure.type)}</td>
      <td className="align-middle">{formatTimestamp(insure.createdOn)}</td>
    </tr>
  );

  const handleSelectedInsurance = (insure) => selectedInsurance(insure);

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
                <h4 className="fw-semibold m-0">Insurance Type</h4>
                <small className="badge fw-normal py-1 px-2 m-0 rounded-1 alert alert-primary ms-2">
                  {totalInsurances}
                </small>
              </div>

              <div className={`d-flex ${isMobile ? "mt-3 flex-column" : ""}`}>
                <SearchInsurance
                  selectedSearchInsurance={handleSelectedInsurance}
                />

                <button
                  onClick={() => newInsurance(true)}
                  className={`btn-dash btn-primary border-0 ${
                    isMobile ? "mt-2 w-100" : ""
                  }`}
                >
                  <AddCircle size={20} />
                  New Insurance
                </button>
              </div>
            </div>

            <hr className="mb-0" />
          </div>

          {isLoadingInsurance && insurances.length === 0 && (
            <div className="col-md-12 dash-body d-flex justify-content-center">
              <Loader />
            </div>
          )}

          {!isLoadingInsurance && insurances.length === 0 && (
            <div className="col-md-12 dash-body text-muted text-center">
              <Trash size={100} variant="Bold" />
              <p className="mt-4 mb-0">No insurances yet</p>
            </div>
          )}

          {!isLoadingInsurance && insurances.length > 0 && (
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
                              onClick={() => changeSortingInsurance("name", true)}
                              className={
                                sortingBtn === `name${true}`
                                  ? "text-text pe-active"
                                  : "text-muted pe-active"
                              }
                            />
                            <ArrowDown2
                              size={12}
                              onClick={() => changeSortingInsurance("name", false)}
                              className={
                                sortingBtn === `name${false}`
                                  ? "text-text pe-active"
                                  : "text-muted pe-active"
                              }
                            />
                          </div>
                        </div>
                      </th>
                      <th scope="col">Type</th>
                      <th scope="col">
                        <div className="d-flex align-items-center">
                          Created On
                          <div className="d-flex flex-column ms-1">
                            <ArrowUp2
                              size={12}
                              onClick={() =>
                                changeSortingInsurance("createdOn", true)
                              }
                              className={
                                sortingBtn === `createdOn${true}`
                                  ? "text-text pe-active"
                                  : "text-muted pe-active"
                              }
                            />
                            <ArrowDown2
                              size={12}
                              onClick={() =>
                                changeSortingInsurance("createdOn", false)
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
                    {(sortedInsurances.length > 0
                      ? sortedInsurances
                      : insurances
                    ).map((insure, index) => renderTableRow(insure, index))}
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

export default Insurance;
