"use client";

import { AddCircle, ArrowDown2, ArrowUp2, Trash } from "iconsax-react";
import SearchPayment from "@/app/_components/payment/search_payment";
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
import { toNGN } from "@/app/_utils/to_currency";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";

const Payment = ({ selectedPayment, newPayment }) => {
  const [isMobile] = useMediaQuery("(max-width: 576px)");
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [payments, setPayments] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [sortedPayments, setSortedPayments] = useState([]);
  const [sortingBtn, setSortingBtn] = useState("");
  const { authUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "transactions"),
        where("to", "==", authUser.email),
        orderBy("createdOn")
      ),
      (snap) => {
        setIsLoadingPayment(false);
        setPayments(snap.docs.map((doc) => doc.data()));
        setTotalPayments(snap.size);
      }
    );

    return () => unsubscribe();
  }, []);

  const changeSortingPayment = (field, isAsc) => {
    const dataToSort =
      sortedPayments.length > 0 ? [...sortedPayments] : [...payments];

    const sorted = dataToSort.sort((_a, _b) => {
      const a = getFieldName(_a, field);
      const b = getFieldName(_b, field);

      return isAsc ? a - b : b - a;
    });

    setSortedPayments(sorted);
    setSortingBtn(`${field}${isAsc}`);
  };

  const renderTableRow = (pay, index) => (
    <tr key={index} className="pe-active" onClick={() => selectedPayment(pay)}>
      <td className="align-middle">{capitalize(truncate(pay.holder, 30))}</td>
      <td className="align-middle">{pay.transID}</td>
      <td className="align-middle">{toNGN(pay.amount)}</td>
      <td className="align-middle">{capitalize(pay.insurance.name)}</td>
      <td className="align-middle">{formatTimestamp(pay.createdOn)}</td>
    </tr>
  );

  const handleSelectedPayment = (pay) => selectedPayment(pay);

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
                <h4 className="fw-semibold m-0">Payment</h4>
                <small className="badge fw-normal py-1 px-2 m-0 rounded-1 alert alert-primary ms-2">
                  {totalPayments}
                </small>
              </div>

              <div className={`d-flex ${isMobile ? "mt-3 flex-column" : ""}`}>
                <SearchPayment selectedSearchPayment={handleSelectedPayment} />

                <button
                  onClick={() => newPayment(true)}
                  className={`btn-dash btn-primary border-0 ${
                    isMobile ? "mt-2 w-100" : ""
                  }`}
                >
                  <AddCircle size={20} />
                  New Payment
                </button>
              </div>
            </div>

            <hr className="mb-0" />
          </div>

          {isLoadingPayment && payments.length === 0 && (
            <div className="col-md-12 dash-body d-flex justify-content-center">
              <Loader />
            </div>
          )}

          {!isLoadingPayment && payments.length === 0 && (
            <div className="col-md-12 dash-body text-muted text-center">
              <Trash size={100} variant="Bold" />
              <p className="mt-4 mb-0">No payments yet</p>
            </div>
          )}

          {!isLoadingPayment && payments.length > 0 && (
            <div className="col-md-12 dash-body px-4 py-0 pb-5">
              <div className="table-responsive ">
                <table className="table table-hover">
                  <thead>
                    <tr className="thead-dash">
                      <th scope="col">Tax Payer</th>
                      <th scope="col">Transaction ID</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Insurance Type</th>
                      <th scope="col">
                        <div className="d-flex align-items-center">
                          Created On
                          <div className="d-flex flex-column ms-1">
                            <ArrowUp2
                              size={12}
                              onClick={() =>
                                changeSortingPayment("createdOn", true)
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
                                changeSortingPayment("createdOn", false)
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
                    {(sortedPayments.length > 0
                      ? sortedPayments
                      : payments
                    ).map((pay, index) => renderTableRow(pay, index))}
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

export default Payment;
