"use client";

import { truncate } from "@/app/_utils/truncate";
import { CloseSquare, Link, TickSquare } from "iconsax-react";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import Loader from "@/app/_components/loader";
import { toast } from "react-toastify";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import capitalize from "@/app/_utils/capitalize";
import copyToClipboard from "@/app/_utils/copy_clipboard";

const EditTo = ({ to, onHide }) => {
  const [show, setShow] = useState(!!to);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const onUpdateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    updateDoc(doc(db, "users", to.email), {
      name: name.length > 0 ? name.toLowerCase() : to.name,
      location: location.length > 0 ? location.toLowerCase() : to.location,
      phoneNumber:
        phoneNumber.length > 0 ? phoneNumber.toLowerCase() : to.phoneNumber,
    })
      .then(() => {
        handleClose();
        toast.dark("Tax Officer updated successfully");
      })
      .catch((e) => {
        toast.error(`Error occured: ${e.message}`, {
          className: "text-danger",
        });
      });
  };

  const deleteTo = (to) => {
    setIsDeleteLoading(true);

    deleteDoc(doc(db, "users", to.email))
      .then(() => {
        handleClose();
        toast.dark("Tax Officer deleted successfully");
      })
      .catch((e) => {
        toast.error(`Error occured: ${e.message}`, {
          className: "text-danger",
        });
      })
      .finally((_) => setIsDeleteLoading(false));
  };

  const changeTo = (to) => {
    setIsStatusLoading(true);

    updateDoc(doc(db, "users", to.email), {
      isSupervisor: to.isSupervisor ? false : true,
      isTaxOfficer: to.isTaxOfficer ? false : true,
    })
      .then(() => {
        handleClose();
        toast.dark("Tax Officer upgraded successfully");
      })
      .catch((e) => {
        toast.error(`Error occured: ${e.message}`, {
          className: "text-danger",
        });
      })
      .finally((_) => setIsStatusLoading(false));
  };

  const copySignUpLink = (to) => {
    const url = "https://pay.northwaveng.com/signup";
    const name = `${to.name}`;
    const email = to.email;
    const signupLink = `${url}?email=${email}&name=${name}`;

    copyToClipboard(signupLink, "Signup link Copied!");
  };

  const handleClose = () => {
    setShow(false);
    if (onHide) onHide();
  };

  return (
    <Modal scrollable show={show} onHide={handleClose}>
      <Modal.Header className="py-2" closeButton>
        <Modal.Title className="h5">
          {truncate(capitalize(to.name), 20)}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 m-0">
        <div className="container-fluid">
          <form className="row" onSubmit={onUpdateUser}>
            <div className="col-md-12">
              <div className="mb-3 mt-2">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control cus-form-control rounded-2"
                  id="name"
                  placeholder={to.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  className="form-control cus-form-control rounded-2"
                  id="email"
                  placeholder={to.email}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="form-control cus-form-control rounded-2"
                  id="phoneNumber"
                  placeholder={to.phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="location">
                  Location
                </label>
                <input
                  type="text"
                  className="form-control cus-form-control rounded-2"
                  id="location"
                  placeholder={to.location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-12 d-flex justify-content-between my-3">
              <div className="d-flex">
                <button
                  type="button"
                  disabled={isDeleteLoading}
                  onClick={() => deleteTo(to)}
                  className="btn-dash bg-danger text-white border-0 me-2"
                >
                  <CloseSquare size={20} />
                  {isDeleteLoading ? <Loader /> : "Delete"}
                </button>

                {!to.hasPassword ? (
                  <button
                    type="button"
                    onClick={() => copySignUpLink(to)}
                    className="btn-dash ms-2"
                  >
                    <Link size={20} />
                    Sign up link
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isStatusLoading}
                    onClick={() => changeTo(to)}
                    className={`btn-dash ${
                      to.isSupervisor ? "bg-warning" : "bg-success"
                    } text-white border-0`}
                  >
                    {isStatusLoading ? (
                      <Loader />
                    ) : to.isSupervisor ? (
                      "Downgrade"
                    ) : (
                      "Upgrade"
                    )}
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-dash btn-primary border-0"
              >
                <TickSquare size={20} />
                {isLoading ? <Loader /> : "Update Tax Officer"}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditTo;
