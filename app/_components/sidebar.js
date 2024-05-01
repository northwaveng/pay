"use client";

import { useState, useEffect } from "react";
import logo from "@/public/logos/logo_text_trans.png";
import {
  ArrowDown2,
  ArrowUp2,
  Box,
  DiscountShape,
  Logout,
  Mobile,
  PresentionChart,
  Setting2,
  StatusUp,
  UserSquare,
} from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { Collapse } from "react-bootstrap";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

const Siderbar = ({ state = "dashboard" }) => {
  const [openOrder, setOpenOrder] = useState(state === "order" || false);
  const [openCustomer, setOpenCustomer] = useState(
    state === "customer" || false
  );
  const [openProduct, setOpenProduct] = useState(state === "product" || false);
  const [openAppControls, setOpenAppControls] = useState(
    state === "app_controls" || false
  );
  const [openCampaign, setOpenCampaign] = useState(
    state === "campaign" || false
  );
  const [openMarket, setOpenMarket] = useState(state === "market" || false);
  const [openReport, setOpenReport] = useState(state === "report" || false);
  const [openSetting, setOpenSetting] = useState(state === "setting" || false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const { authUser, logOut } = useAuth();

  useEffect(() => {
    if (authUser) {
      const userRef = doc(db, "admins", authUser.email);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) setUser(doc.data());
        else toast.error("Customer not found");
      });
      return () => unsubscribe();
    }
  }, [authUser]);

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <div className="sidebar-header">
          <Link
            scroll
            replace
            href="/"
            className="fw-bold text-decoration-none text-dark"
          >
            <Image src={logo} width={150} priority alt="logo" />
          </Link>
        </div>
{/* 
        <ul className="sidebar-child">
          <li>
            <Link
              scroll
              replace
              href="/"
              className={`sidebar-child-btn justify-content-start ${
                pathname === "/" ? "text-dark" : ""
              }`}
            >
              <StatusUp className="me-2" />
              Dashboard
            </Link>
          </li>

          <li>
            <button
              className={`sidebar-child-btn ${openOrder ? "text-dark" : ""}`}
              onClick={() => setOpenOrder(!openOrder)}
              aria-controls="openOrder"
              aria-expanded={openOrder}
            >
              <div>
                <Image
                  src={openOrder ? orderBagBlack : orderBag}
                  width={24}
                  priority
                  alt="bag"
                  className="me-2"
                />
                Orders
              </div>

              {openOrder ? <ArrowUp2 size={13} /> : <ArrowDown2 size={13} />}
            </button>

            <Collapse in={openOrder}>
              <div id="openOrder">
                <ul className="sidebar-grand-child">
                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="/orders"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/orders") ? "text-dark" : ""
                      }`}
                    >
                      All Orders
                    </Link>
                  </li>

                  <li>
                    <Link
                      scroll
                      replace
                      href="/orders/cancelled"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/orders/cancelled")
                          ? "text-dark"
                          : ""
                      }`}
                    >
                      Cancelled
                    </Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li>
            <button
              className={`sidebar-child-btn ${openCustomer ? "text-dark" : ""}`}
              onClick={() => setOpenCustomer(!openCustomer)}
              aria-controls="openCustomer"
              aria-expanded={openCustomer}
            >
              <div>
                <UserSquare
                  variant={openCustomer ? "Bold" : "Linear"}
                  className="me-2"
                />
                Customers
              </div>

              {openCustomer ? <ArrowUp2 size={13} /> : <ArrowDown2 size={13} />}
            </button>

            <Collapse in={openCustomer}>
              <div id="openCustomer">
                <ul className="sidebar-grand-child">
                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="/customers"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/customers") ? "text-dark" : ""
                      }`}
                    >
                      All Customers
                    </Link>
                  </li>

                  <li>
                    <Link
                      scroll
                      replace
                      href="#"
                      className="sidebar-grand-child-btn"
                      // href="/customers/groups"
                      // className={`sidebar-grand-child-btn ${
                      //   pathname.endsWith("/customers/groups") ? "text-dark":""
                      // }`}
                    >
                      Groups
                      <small className="badge fw-normal py-0 px-2 m-0 rounded-1 alert alert-primary ms-2">
                        soon
                      </small>
                    </Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li>
            <button
              className={`sidebar-child-btn ${openProduct ? "text-dark" : ""}`}
              onClick={() => setOpenProduct(!openProduct)}
              aria-controls="openProduct"
              aria-expanded={openProduct}
            >
              <div>
                <Box
                  variant={openProduct ? "Bold" : "Linear"}
                  className="me-2"
                />
                Products
              </div>

              {openProduct ? <ArrowUp2 size={13} /> : <ArrowDown2 size={13} />}
            </button>

            <Collapse in={openProduct}>
              <div id="openProduct">
                <ul className="sidebar-grand-child">
                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="/products"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/products") ? "text-dark" : ""
                      }`}
                    >
                      All Products
                    </Link>
                  </li>

                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="/products/feedbacks"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/products/feedbacks")
                          ? "text-dark"
                          : ""
                      }`}
                    >
                      Feedbacks
                    </Link>
                  </li>

                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="/products/sellers"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/products/sellers")
                          ? "text-dark"
                          : ""
                      }`}
                    >
                      Sellers
                    </Link>
                  </li>

                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="/products/brands"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/products/brands") ? "text-dark" : ""
                      }`}
                    >
                      Brands
                    </Link>
                  </li>

                  <li>
                    <Link
                      scroll
                      replace
                      href="/products/categories"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/products/categories")
                          ? "text-dark"
                          : ""
                      }`}
                    >
                      Categories
                    </Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li>
            <button
              className={`sidebar-child-btn ${
                openAppControls ? "text-dark" : ""
              }`}
              onClick={() => setOpenAppControls(!openAppControls)}
              aria-controls="openAppControls"
              aria-expanded={openAppControls}
            >
              <div>
                <Mobile
                  variant={openAppControls ? "Bold" : "Linear"}
                  className="me-2"
                />
                App Controls
              </div>

              {openAppControls ? (
                <ArrowUp2 size={13} />
              ) : (
                <ArrowDown2 size={13} />
              )}
            </button>

            <Collapse in={openAppControls}>
              <div id="openAppControls">
                <ul className="sidebar-grand-child">
                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="/app_controls"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/app_controls") ? "text-dark" : ""
                      }`}
                    >
                      All Controls
                    </Link>
                  </li>

                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="/app_controls/advertisement"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/app_controls/advertisement")
                          ? "text-dark"
                          : ""
                      }`}
                    >
                      Advertisement
                    </Link>
                  </li>

                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="/app_controls/versioning"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/app_controls/versioning")
                          ? "text-dark"
                          : ""
                      }`}
                    >
                      Versioning
                    </Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li>
            <button
              className={`sidebar-child-btn ${openCampaign ? "text-dark" : ""}`}
              onClick={() => setOpenCampaign(!openCampaign)}
              aria-controls="openCampaign"
              aria-expanded={openCampaign}
            >
              <div>
                <DiscountShape
                  variant={openCampaign ? "Bold" : "Linear"}
                  className="me-2"
                />
                Campaigns
              </div>

              {openCampaign ? <ArrowUp2 size={13} /> : <ArrowDown2 size={13} />}
            </button>

            <Collapse in={openCampaign}>
              <div id="openCampaign">
                <ul className="sidebar-grand-child">
                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="/campaigns"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/campaigns") ? "text-dark" : ""
                      }`}
                    >
                      All Campaigns
                    </Link>
                  </li>

                  <li>
                    <Link
                      scroll
                      replace
                      href="/campaigns/coupons"
                      className={`sidebar-grand-child-btn ${
                        pathname.endsWith("/campaigns/coupons")
                          ? "text-dark"
                          : ""
                      }`}
                    >
                      Coupons
                    </Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li>
            <button
              className={`sidebar-child-btn ${openMarket ? "text-dark" : ""}`}
              onClick={() => setOpenMarket(!openMarket)}
              aria-controls="openMarket"
              aria-expanded={openMarket}
            >
              <div>
                <Image
                  src={openMarket ? marketingBlack : marketing}
                  width={24}
                  priority
                  alt="marketing"
                  className="me-2"
                />
                Marketing
                <small className="badge fw-normal py-0 px-2 m-0 rounded-1 alert alert-primary ms-2">
                  soon
                </small>
              </div>

              {openMarket ? <ArrowUp2 size={13} /> : <ArrowDown2 size={13} />}
            </button>

            <Collapse in={openMarket}>
              <div id="openMarket">
                <ul className="sidebar-grand-child">
                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="#"
                      className="sidebar-grand-child-btn"
                    >
                      Email Marketing
                    </Link>
                  </li>

                  <li>
                    <Link
                      scroll
                      replace
                      href="#"
                      className="sidebar-grand-child-btn"
                    >
                      SMS Marketing
                    </Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li>
            <button
              className={`sidebar-child-btn ${openReport ? "text-dark" : ""}`}
              onClick={() => setOpenReport(!openReport)}
              aria-controls="openReport"
              aria-expanded={openReport}
            >
              <div>
                <PresentionChart
                  variant={openReport ? "Bold" : "Linear"}
                  className="me-2"
                />
                Reports
                <small className="badge fw-normal py-0 px-2 m-0 rounded-1 alert alert-primary ms-2">
                  soon
                </small>
              </div>

              {openReport ? <ArrowUp2 size={13} /> : <ArrowDown2 size={13} />}
            </button>

            <Collapse in={openReport}>
              <div id="openReport">
                <ul className="sidebar-grand-child">
                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="#"
                      className="sidebar-grand-child-btn"
                    >
                      Sales Report
                    </Link>
                  </li>

                  <li>
                    <Link
                      scroll
                      replace
                      href="#"
                      className="sidebar-grand-child-btn"
                    >
                      Return Report
                    </Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li>
            <button
              className={`sidebar-child-btn ${openSetting ? "text-dark" : ""}`}
              onClick={() => setOpenSetting(!openSetting)}
              aria-controls="openSetting"
              aria-expanded={openSetting}
            >
              <div>
                <Setting2
                  variant={openSetting ? "Bold" : "Linear"}
                  className="me-2"
                />
                Settings
                <small className="badge fw-normal py-0 px-2 m-0 rounded-1 alert alert-primary ms-2">
                  soon
                </small>
              </div>

              {openSetting ? <ArrowUp2 size={13} /> : <ArrowDown2 size={13} />}
            </button>

            <Collapse in={openSetting}>
              <div id="openSetting">
                <ul className="sidebar-grand-child">
                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="#"
                      className="sidebar-grand-child-btn"
                    >
                      General Settings
                    </Link>
                  </li>

                  <li className="pb-3">
                    <Link
                      scroll
                      replace
                      href="#"
                      className="sidebar-grand-child-btn"
                    >
                      Tax Settings
                    </Link>
                  </li>

                  <li>
                    <Link
                      scroll
                      replace
                      href="#"
                      className="sidebar-grand-child-btn"
                    >
                      Currency Settings
                    </Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>
        </ul> */}
      </div>

      {user && (
        <button
          onClick={logOut}
          className="btn-dash sidebar-user-btn rounded-2"
        >
          <Logout variant="Bold" className="me-2" />
          Sign Out
        </button>
      )}
    </div>
  );
};

export default Siderbar;
