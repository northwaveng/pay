"use client";

import { truncate } from "@/app/_utils/truncate";
import { CloseSquare, TickSquare } from "iconsax-react";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import Loader from "@/app/_components/loader";
import { toast } from "react-toastify";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import capitalize from "@/app/_utils/capitalize";

const EditInsurance = ({ insurance, onHide }) => {
  const [show, setShow] = useState(!!insurance);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const onUpdateInsuranceType = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    updateDoc(doc(db, "insurances", insurance.id), {
      name: name.length > 0 ? name.toLowerCase() : insurance.name,
      type: type.length > 0 ? type.toLowerCase() : insurance.type,
    })
      .then(() => {
        handleClose();
        toast.dark("Insurance Type updated successfully");
      })
      .catch((e) => {
        toast.dark(`Error occured: ${e.message}`, {
          className: "text-danger",
        });
      });
  };

  const deleteInsurance = (insurance) => {
    setIsDeleteLoading(true);

    deleteDoc(doc(db, "insurances", insurance.id))
      .then(() => {
        handleClose();
        toast.dark("Insurance Type deleted successfully");
      })
      .catch((e) => {
        toast.dark(`Error occured: ${e.message}`, {
          className: "text-danger",
        });
      })
      .finally((_) => setIsDeleteLoading(false));
  };

  const handleClose = () => {
    setShow(false);
    if (onHide) onHide();
  };

  return (
    <Modal scrollable show={show} onHide={handleClose}>
      <Modal.Header className="py-2" closeButton>
        <Modal.Title className="h5">
          {truncate(capitalize(insurance.name), 20)}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 m-0">
        <div className="container-fluid">
          <form className="row" onSubmit={onUpdateInsuranceType}>
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
                  id="type"
                  placeholder="eg: private"
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-12 d-flex justify-content-between my-3">
              <button
                type="button"
                disabled={isDeleteLoading}
                onClick={() => deleteInsurance(insurance)}
                className="btn-dash bg-danger text-white border-0"
              >
                <CloseSquare size={20} />
                {isDeleteLoading ? <Loader /> : "Delete"}
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-dash btn-primary border-0"
              >
                <TickSquare size={20} />
                {isLoading ? <Loader /> : "Update Insurance Type"}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditInsurance;
