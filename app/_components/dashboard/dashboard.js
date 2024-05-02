"use client";

import {
  Chart,
  Money4,
  People,
  SecuritySafe,
  StatusUp,
  UserTick,
} from "iconsax-react";
import { db } from "@/app/_components/firebase/fire_config";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Loader from "@/app/_components/loader";
import Link from "next/link";
import { toNGN } from "@/app/_utils/to_currency";
import { useMediaQuery } from "@chakra-ui/react";

const Dashboard = () => {
  const [isTablet] = useMediaQuery("(max-width: 768px)");
  const [isMobile] = useMediaQuery("(max-width: 576px)");
  const [totalUsers, setTotalUsers] = useState("0");
  const [totalTo, setTotalTo] = useState("0");
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snap) => {
      setTotalUsers(snap.size);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const collRef = collection(db, "users");

    const unsubscribe = onSnapshot(
      query(collRef, where("taxOfficer", "==", true)),
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

  return (
    <div className="content">
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

        <div className="row mt-5 justify-content-center">
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
                <Chart
                  size={50}
                  variant="Bulk"
                  className="text-primary"
                />
                {!isMobile && <small className="mt-1 text-muted">Reports</small>}
              </Link>
            </div>
          </div>

          <div className="col-6 col-md-4">
            <div className="mb-3 d-flex justify-content-center">
              <Link
                href="/to"
                className="card rounded-circle dashboard-others"
              >
                <People
                  size={50}
                  variant="Bulk"
                  className="text-primary"
                />
                {!isMobile && (
                  <small className="mt-1 text-muted">Tax Officers</small>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
