"use client";

import { TickSquare } from "iconsax-react";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import Loader from "@/app/_components/loader";
import { toast } from "react-toastify";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";

const NewTo = ({ newTo, onHide }) => {
  const [show, setShow] = useState(!!newTo);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nin, setNIN] = useState(null);
  const [driverLicense, setDriverLicense] = useState(null);

  const onAddTo = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const collRef = collection(db, "users");
    const userDoc = {
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      location: location.toLowerCase(),
      phoneNumber: phoneNumber.toLowerCase(),
      nin: nin,
      driverLicense: driverLicense,
      vin: "",
      chasis: "",
      isSupervisor: false,
      isTaxOfficer: true,
      hasPassword: false,
      state: "",
      lga: "",
      createdOn: serverTimestamp(),
    };

    setDoc(doc(collRef, email.toLowerCase()), userDoc)
      .then(() => {
        handleClose();
        toast.dark("Tax Officer added successfully");
      })
      .catch((e) => {
        toast.dark(`Error occured: ${e.message}`, {
          className: "text-danger",
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleClose = () => {
    setShow(false);
    if (onHide) onHide();
  };

  return (
    <Modal scrollable show={show} onHide={handleClose}>
      <Modal.Header className="py-2" closeButton>
        <Modal.Title className="h5">New Tax Officer</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 m-0">
        <div className="container-fluid">
          <form className="row" onSubmit={onAddTo}>
            <div className="col-md-12">
              <div className="mb-3 mt-2">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="form-control cus-form-control rounded-2"
                  id="name"
                  placeholder="eg: third party only"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="form-control cus-form-control rounded-2"
                  id="email"
                  placeholder="eg: abc@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  className="form-control cus-form-control rounded-2"
                  id="phoneNumber"
                  placeholder="eg: 08000000000"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="location">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="form-control cus-form-control rounded-2"
                  id="location"
                  placeholder="eg: NO: 10 ABC"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <label className="form-label" htmlFor="nin">
                      NIN
                    </label>
                    <input
                      type="text"
                      required={driverLicense === null}
                      disabled={driverLicense && driverLicense.length > 0}
                      className="form-control cus-form-control rounded-2"
                      id="nin"
                      placeholder="eg: 0000000000"
                      onChange={(e) => setNIN(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label" htmlFor="driverLicense">
                      Driver License
                    </label>
                    <input
                      type="text"
                      required={nin === null}
                      disabled={nin && nin.length > 0}
                      className="form-control cus-form-control rounded-2"
                      id="driverLicense"
                      placeholder="eg: 0000000000"
                      onChange={(e) => setDriverLicense(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 d-flex justify-content-end my-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-dash btn-primary border-0"
              >
                <TickSquare size={20} />
                {isLoading ? <Loader /> : "New Tax Officer"}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NewTo;
