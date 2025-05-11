"use client";

import { TickSquare } from "iconsax-react";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import Loader from "@/app/_components/loader";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";

const NewDva = ({ newDva, onHide }) => {
  const [show, setShow] = useState(!!newDva);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const onAddDva = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // const collRef = collection(db, "dvas");
    // const dvaDoc = {
    //   id: null,
    //   bankName: bankName.toLowerCase(),
    //   accountName: accountName.toLowerCase(),
    //   accountNumber: accountNumber,
    //   createdOn: serverTimestamp(),
    // };

    // addDoc(collRef, dvaDoc)
    //   .then((dva) => {
    //     updateDoc(doc(db, "dvas", dva.id), { id: dva.id })
    //       .then(() => {
    //         handleClose();
    //         toast.dark("Dva added successfully");
    //       })
    //       .catch((e) => {
    //         toast.error(`Error occured while updating dva ID: ${e.message}`, {
    //           className: "text-danger",
    //         });
    //       });
    //   })
    //   .catch((e) => {
    //     toast.error(`Error occured: ${e.message}`, {
    //       className: "text-danger",
    //     });
    //   })
    //   .finally(() => setIsLoading(false));
  };

  const handleClose = () => {
    setShow(false);
    if (onHide) onHide();
  };

  return (
    <Modal scrollable show={show} onHide={handleClose}>
      <Modal.Header className="py-2" closeButton>
        <Modal.Title className="h5">New Dva</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 m-0">
        <div className="container-fluid">
          <form className="row" onSubmit={onAddDva}>
            <div className="col-md-12">
              <div className="mb-3 mt-2">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="form-control cus-form-control rounded-2"
                  id="email"
                  placeholder="eg: jondoe@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3 mt-2">
                <label className="form-label" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="form-control cus-form-control rounded-2"
                  id="firstName"
                  placeholder="Jon"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="mb-3 mt-2">
                <label className="form-label" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="form-control cus-form-control rounded-2"
                  id="lastName"
                  placeholder="Doe"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-12 d-flex justify-content-end my-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-dash btn-primary border-0"
              >
                <TickSquare size={20} />
                {isLoading ? <Loader /> : "New Dva"}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NewDva;
