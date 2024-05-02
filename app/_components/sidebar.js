"use client";

import { useState, useEffect } from "react";
import logo from "@/public/logos/logo_text_dark_trans.png";
import {
  Chart,
  Logout,
  Money4,
  People,
  SecuritySafe,
  StatusUp,
} from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useMediaQuery } from "@chakra-ui/react";

const Siderbar = () => {
  const [isTablet] = useMediaQuery("(max-width: 768px)");
  const [isMobile] = useMediaQuery("(max-width: 576px)");
  const [user, setUser] = useState(null);
  const path = usePathname();
  const { authUser, logOut } = useAuth();

  useEffect(() => {
    if (authUser) {
      const userRef = doc(db, "users", authUser.email);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) setUser(doc.data());
        else toast.error("Account not found");
      });
      return () => unsubscribe();
    }
  }, [authUser]);

  return (
    <section className="sidebar">
      <div className="sidebar-menu">
        <div className={`sidebar-header ${isMobile ? "text-center" : ""}`}>
          <Link
            scroll
            replace
            href="/"
            className="fw-bold text-decoration-none text-primary"
          >
            <Image src={logo} width={isMobile ? 25 : 50} priority alt="logo" />
          </Link>
        </div>

        {user &&
          (user.isSupervisor ? (
            <ul className="sidebar-child">
              <li>
                <Link
                  scroll
                  replace
                  href="/"
                  className={`sidebar-child-btn justify-content-start ${
                    path === "/" ? "text-primary" : ""
                  }`}
                >
                  <StatusUp className={isTablet ? "" : "me-2"} />
                  {isTablet ? "" : "Transactions"}
                </Link>
              </li>

              <li>
                <Link
                  scroll
                  replace
                  href="/insurance"
                  className={`sidebar-child-btn justify-content-start ${
                    path.endsWith("/insurance") ? "text-primary" : ""
                  }`}
                >
                  <SecuritySafe className={isTablet ? "" : "me-2"} />
                  {isTablet ? "" : "Insurance"}
                </Link>
              </li>

              <li>
                <Link
                  scroll
                  replace
                  href="/reports"
                  className={`sidebar-child-btn justify-content-start ${
                    path.endsWith("/reports") ? "text-primary" : ""
                  }`}
                >
                  <Chart className={isTablet ? "" : "me-2"} />
                  {isTablet ? "" : "Reports"}
                </Link>
              </li>

              <li>
                <Link
                  scroll
                  replace
                  href="/to"
                  className={`sidebar-child-btn justify-content-start ${
                    path.endsWith("/to") ? "text-primary" : ""
                  }`}
                >
                  <People className={isTablet ? "" : "me-2"} />
                  {isTablet ? "" : "Tax Officers"}
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="sidebar-child">
              <li>
                <Link
                  scroll
                  replace
                  href="/"
                  className={`sidebar-child-btn justify-content-start ${
                    path === "/" ? "text-primary" : ""
                  }`}
                >
                  <People className={isTablet ? "" : "me-2"} />
                  {isTablet ? "" : "Tax Payer"}
                </Link>
              </li>

              <li>
                <Link
                  scroll
                  replace
                  href="/payment"
                  className={`sidebar-child-btn justify-content-start ${
                    path.endsWith("/payment") ? "text-primary" : ""
                  }`}
                >
                  <Money4 className={isTablet ? "" : "me-2"} />
                  {isTablet ? "" : "Payment"}
                </Link>
              </li>
            </ul>
          ))}
      </div>

      {user && (
        <button
          onClick={logOut}
          className="btn-dash sidebar-user-btn rounded-2"
          style={{ margin: isTablet ? "0 10px 10px 10px" : "0 20px 20px 20px" }}
        >
          <Logout variant="Bold" color="#346BC8" className="me-2" />
          {isTablet ? "" : "Sign Out"}
        </button>
      )}
    </section>
  );
};

export default Siderbar;
