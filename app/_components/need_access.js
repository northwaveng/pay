import Link from "next/link";
import logo from "@/public/logos/logo_text_trans.png";
import Image from "next/image";

export default function NeedAccess() {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        <div className="col-md-12 text-center">
          <Image src={logo} width={200} priority alt="logo" />

          <h4 className="mt-5">You do not have access to this page!</h4>

          <div className="d-flex justify-content-center mt-4">
            <Link href="/" className="btn-dash btn-primary">
              Return To Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
