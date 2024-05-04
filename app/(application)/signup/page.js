"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/app/_components/loader";
import { notFound, useRouter } from "next/navigation";
import { Information } from "iconsax-react";
import logo from "@/public/logos/logo_text_trans.png";
import Image from "next/image";
import capitalize from "@/app/_utils/capitalize";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";

const SignupOldCustomer = ({ searchParams }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { loading, authUser, signUp } = useAuth();
  const router = useRouter();
  const { email, name } = searchParams;

  if (!email || !name) notFound();

  if (loading && authUser) return <Loader fullHeight={true} color="black" />;

  if (authUser && Cookies.get("PayNWSignedIn")) {
    return (
      <div className="d-flex align-items-center vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <Information size={150} />
              <p>You logged in already.</p>

              <hr />

              <div className="d-flex justify-content-center">
                <Link href="/" className="btn-dash btn-primary w-50">
                  NorthWave - Pay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);

    signUp(email, password)
      .then(() => {
        updateDoc(doc(db, "users", email), {
          hasPassword: true,
        })
          .then(() => {
            toast.dark("🎉 Congratulation");
            router.replace("https://pay.northwaveng.com/");
          })
          .catch((e) => {
            toast.dark(`Error occured while updating customer: ${e.message}`, {
              className: "text-danger",
            });
          });
      })
      .catch((e) => {
        if (e.code === "auth/weak-password") {
          toast.error("Weak password", {
            className: "text-danger",
          });
        } else if (e.code === "auth/email-already-in-use") {
          toast.error("😞 Account already exists", {
            className: "text-danger",
          });
        } else {
          toast.error("😲 Error while signing tax officer up", {
            className: "text-danger",
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="d-flex vh-100 text-center">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="mb-auto" />

        <div className="row justify-content-center">
          <Link href="/">
            <Image src={logo} width={150} priority alt="logo" />
          </Link>

          <p className="m-0 text-muted mb-3">{capitalize(name)}</p>

          <form className="col-md-4 text-start" onSubmit={onSignup}>
            <div className="mb-3">
              <label className="form-label" htmlFor="emailAddress">
                Email address
              </label>
              <input
                type="email"
                required
                disabled
                className="form-control cus-form-control rounded-2"
                id="emailAddress"
                placeholder={email}
                value={email}
              />
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                required
                className="form-control cus-form-control rounded-2"
                id="password"
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-dash btn-primary w-100"
            >
              {isLoading ? <Loader /> : "Sign Up"}
            </button>
          </form>
        </div>

        <footer className="mt-auto text-muted" />
      </div>
    </div>
  );
};

export default SignupOldCustomer;
