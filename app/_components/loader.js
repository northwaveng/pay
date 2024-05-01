"use client";

import logo from "@/public/logos/logo_trans.png";
import Image from "next/image";

const Loader = ({
  size = 100,
  isAwait = false,
  fullHeight = false,
  className = "",
}) => {
  if (fullHeight) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Image
          src={logo}
          width={size}
          priority
          alt="logo"
          className="loader-img"
          
        />
      </div>
    );
  } else {
    return isAwait ? (
      <div className="loader-await" />
    ) : (
      <div className={`loader ${className}`} />
    );
  }
};

export default Loader;
