"use client";

import logo from "@/public/logos/logo_text_trans.png";
import Image from "next/image";

const GlobalError = ({ error, reset }) => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        <div className="col-md-12 text-center">
          <Image
            src={logo}
            width={200}
            priority
            alt="logo"
          />

          <h4 className="mt-5">Something went wrong!</h4>

          <div className="d-flex justify-content-center mt-4">
            <button onClick={() => reset()} className="btn-dash btn-primary">
              Try Again
            </button>
          </div>

          <div className="alert alert-primary mt-4 p-2" role="alert">
            {error.message}
            <hr />
            <b>HASH:</b> {error.digest || "NONE"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalError;
