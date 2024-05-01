"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logos/logo_text_trans.png";

const NotFound = () => (
  <div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="row">
      <div className="col-md-12 text-center">
        <Image src={logo} width={200} priority alt="logo" />

        <h4 className="mt-5">Page Not Found</h4>

        <div className="alert alert-primary mt-4 p-2" role="alert">
          This page does not exist
        </div>

        <Link href="/" className="btn-dash btn-primary mt-4">
          Return To Dashboard
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
