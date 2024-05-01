"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/app/_components/loader";
import { useRouter } from "next/navigation";
import { Information } from "iconsax-react";
import logo from "@/public/logos/logo_text_trans.png";
import Image from "next/image";

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, authUser, signIn } = useAuth();
  const router = useRouter();

  if (loading && authUser) return <Loader fullHeight={true} color="black" />;

  if (authUser && Cookies.get("PayNWSignedIn")) {
    return (
      <div className="d-flex align-items-center vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <Information size={200} />
              <p>You logged in already.</p>

              <hr />

              <div className="d-flex justify-content-center">
                <Link href="/" className="btn-dash btn-dark w-50">
                  Al Gendini!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onSignin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await signIn(email, password)
      .then(() => {
        Cookies.set("PayNWSignedIn", true, {
          expires: 14,
        });
        toast.dark("Welcome");
        router.push("/");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-login-credentials") {
          toast.dark("Invalid sign in credentials", {
            className: "text-danger",
          });
        } else if (error.code === "auth/too-many-requests") {
          toast.dark("Too many requests", {
            className: "text-danger",
          });
        } else {
          toast.dark(`Error: ${error.message}`, {
            className: "text-danger",
          });
        }
      })
      .finally((_) => setIsLoading(false));
  };

  return (
    <div className="d-flex vh-100 text-center">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="mb-auto" />

        <div className="row justify-content-center">
          <Link href="/">
            <Image src={logo} width={150} priority alt="logo" />
          </Link>

          <form className="col-md-4 text-start mt-5" onSubmit={onSignin}>
            <div className="mb-3">
              <label className="form-label" htmlFor="emailAddress">
                Email address
              </label>
              <input
                type="email"
                required
                className="form-control cus-form-control rounded-2"
                id="emailAddress"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-dash btn-primary w-100"
            >
              {isLoading ? <Loader /> : "Sign In"}
            </button>
          </form>
        </div>

        <footer className="mt-auto text-muted" />
      </div>
    </div>
  );
};

export default Signin;
