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

const NewInsurance = ({ newInsurance, onHide }) => {
  const [show, setShow] = useState(!!newInsurance);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const onAddInsuranceType = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const collRef = collection(db, "insurances");
    const insureDoc = {
      id: null,
      name: name.toLowerCase(),
      type: type.toLowerCase(),
      createdOn: serverTimestamp(),
    };

    addDoc(collRef, insureDoc)
      .then((insure) => {
        updateDoc(doc(db, "insurances", insure.id), { id: insure.id })
          .then(() => {
            handleClose();
            toast.dark("Insurance Type added successfully");
          })
          .catch((e) => {
            toast.dark(
              `Error occured while updating insurance ID: ${e.message}`,
              {
                className: "text-danger",
              }
            );
          });
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
        <Modal.Title className="h5">New Insurance Type</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 m-0">
        <div className="container-fluid">
          <form className="row" onSubmit={onAddInsuranceType}>
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

              <div className="mb-3 mb-2">
                <label className="form-label" htmlFor="type">
                  Type
                </label>
                <input
                  type="text"
                  required
                  className="form-control cus-form-control rounded-2"
                  id="insureType"
                  placeholder="eg: private"
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-12 d-flex justify-content-end my-3">
              <button
                disabled={isLoading}
                className="btn-dash btn-primary border-0"
              >
                <TickSquare size={20} />
                {isLoading ? <Loader /> : "New Insurance Type"}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NewInsurance;
