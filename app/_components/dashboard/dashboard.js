"use client";

import {
  ArrowDown2,
  ArrowUp2,
  Chart,
  Money4,
  People,
  SecuritySafe,
  StatusUp,
  Trash,
  UserTick,
} from "iconsax-react";
import { db } from "@/app/_components/firebase/fire_config";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Loader from "@/app/_components/loader";
import Link from "next/link";
import { toNGN } from "@/app/_utils/to_currency";
import { useMediaQuery } from "@chakra-ui/react";
import capitalize from "@/app/_utils/capitalize";
import { truncate } from "@/app/_utils/truncate";
import { formatTimestamp } from "@/app/_utils/format_timestamp";
import SearchPayment from "@/app/_components/payment/search_payment";
import EditPayment from "@/app/_components/payment/edit_payment";

const Dashboard = () => {
  const [isTablet] = useMediaQuery("(max-width: 768px)");
  const [isMobile] = useMediaQuery("(max-width: 576px)");
  const [totalUsers, setTotalUsers] = useState("0");
  const [totalTo, setTotalTo] = useState("0");
  const [transactions, setTransactions] = useState(null);

  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [payments, setPayments] = useState([]);
  const [sortedPayments, setSortedPayments] = useState([]);
  const [sortingBtn, setSortingBtn] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snap) => {
      setTotalUsers(snap.size);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const collRef = collection(db, "users");

    const unsubscribe = onSnapshot(
      query(collRef, where("isTaxOfficer", "==", true)),
      (snap) => setTotalTo(snap.size)
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "transactions", "info"), (snap) => {
      if (snap.exists()) setTransactions(snap.data());
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "transactions"), orderBy("createdOn", "desc")),
      (snap) => {
        setIsLoadingPayment(false);
        setPayments(snap.docs.map((doc) => doc.data()));
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
    <tr
      key={index}
      className="pe-active"
      onClick={() => setSelectedPayment(pay)}
    >
      <td className="align-middle">{capitalize(truncate(pay.holder, 30))}</td>
      <td className="align-middle">{pay.transID}</td>
      <td className="align-middle">{toNGN(pay.amount)}</td>
      <td className="align-middle">{capitalize(pay.insurance.name)}</td>
      <td className="align-middle">{formatTimestamp(pay.createdOn)}</td>
    </tr>
  );

  return (
    <>
      <div className="content overflow-none">
        <div className="container-fluid">
          <div className="row mt-4">
            <div className="col-6 col-md-3">
              <div className="my-3 card d-flex justify-content-center flex-row align-items-center p-2 mb-2 text-decoration-none">
                {!isTablet && (
                  <People size={80} variant="Bold" className="text-primary" />
                )}

                <div className="ms-2">
                  <h3 className="text-primary">{totalUsers}</h3>
                  {isTablet ? (
                    <small className="m-0 text-muted">Users</small>
                  ) : (
                    <p className="m-0 text-muted">Total Users</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="my-3 card d-flex justify-content-center flex-row align-items-center p-2 mb-2 text-decoration-none">
                {!isTablet && (
                  <UserTick size={80} variant="Bold" className="text-primary" />
                )}

                <div className="ms-2">
                  <h3 className="text-primary">{totalTo}</h3>
                  {isTablet ? (
                    <small className="m-0 text-muted">TOs</small>
                  ) : (
                    <p className="m-0 text-muted">Total Tax Officers</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="my-3 card d-flex justify-content-center flex-row align-items-center p-2 mb-2 text-decoration-none">
                {!isTablet && (
                  <StatusUp size={80} variant="Bold" className="text-primary" />
                )}

                <div className="ms-2">
                  <h3 className="text-primary">
                    {!transactions ? <Loader /> : transactions.total}
                  </h3>
                  {isTablet ? (
                    <small className="m-0 text-muted">Transactions</small>
                  ) : (
                    <p className="m-0 text-muted">Total Transactions</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="my-3 card d-flex justify-content-center flex-row align-items-center p-2 mb-2">
                {!isTablet && (
                  <Money4 size={80} variant="Bold" className="text-primary" />
                )}

                <div className="ms-2">
                  <h4 className="text-primary">
                    {!transactions ? <Loader /> : toNGN(transactions.totalPaid)}
                  </h4>
                  {isTablet ? (
                    <small className="m-0 text-muted">Paid</small>
                  ) : (
                    <p className="m-0 text-muted">Total Paid</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            {isLoadingPayment && payments.length === 0 && (
              <div className="col-md-12 dash-body m-0 d-flex justify-content-center">
                <Loader />
              </div>
            )}

            {!isLoadingPayment && payments.length === 0 && (
              <div className="col-md-12 dash-body m-0 text-muted text-center">
                <Trash size={100} variant="Bold" />
                <p className="mt-4 mb-0">No payments yet</p>
              </div>
            )}

            {!isLoadingPayment && payments.length > 0 && (
              <div className="col-md-12 dash-body m-0 px-4 py-0 pb-5">
                <div className="w-100 d-flex justify-content-end mb-3">
                  <SearchPayment
                    selectedSearchPayment={(pay) => setSelectedPayment(pay)}
                  />
                </div>

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

          <div className="row mt-3 justify-content-center">
            <div className="col-6 col-md-4">
              <div className="mb-3 d-flex justify-content-center">
                <Link
                  href="/insurance"
                  className="card rounded-circle dashboard-others"
                >
                  <SecuritySafe
                    size={50}
                    variant="Bulk"
                    className="text-primary"
                  />
                  {!isMobile && (
                    <small className="mt-1 text-muted">Insurance</small>
                  )}
                </Link>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="mb-3 d-flex justify-content-center">
                <Link
                  href="/reports"
                  className="card rounded-circle dashboard-others"
                >
                  <Chart size={50} variant="Bulk" className="text-primary" />
                  {!isMobile && (
                    <small className="mt-1 text-muted">Reports</small>
                  )}
                </Link>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="mb-3 d-flex justify-content-center">
                <Link
                  href="/to"
                  className="card rounded-circle dashboard-others"
                >
                  <People size={50} variant="Bulk" className="text-primary" />
                  {!isMobile && (
                    <small className="mt-1 text-muted">Tax Officers</small>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPayment && (
        <EditPayment
          payment={selectedPayment}
          onHide={() => setSelectedPayment(null)}
          isSupervisor={true}
        />
      )}
    </>
  );
};

export default Dashboard;
