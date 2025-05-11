"use client";

import { truncate } from "@/app/_utils/truncate";
import { CloseSquare, TickSquare } from "iconsax-react";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import Loader from "@/app/_components/loader";
import { toast } from "react-toastify";
import capitalize from "@/app/_utils/capitalize";

const EditDva = ({ dva, onHide }) => {
  const [show, setShow] = useState(!!dva);

  const onUpdateDva = async (e) => {
    e.preventDefault();

    toast.info("You can not update DVA information!");
  };

  const deleteDva = (dva) => {
    setIsDeleteLoading(true);

    toast.info("Coming soon!");
  };

  const handleClose = () => {
    setShow(false);
    if (onHide) onHide();
  };

  return (
    <Modal scrollable show={show} onHide={handleClose}>
      <Modal.Header className="py-2" closeButton>
        <Modal.Title className="h5">
          {truncate(capitalize(dva.name), 20)}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 m-0">
        <div className="container-fluid">
          <form className="row" onSubmit={onUpdateDva}>
            <div className="col-md-12">
              <div className="mb-3 mt-2">
                <label className="form-label" htmlFor="bankName">
                  Bank Name
                </label>
                <input
                  type="text"
                  readOnly
                  className="form-control cus-form-control rounded-2"
                  id="bankName"
                  placeholder="bank name"
                  value={dva.bankName}
                />
              </div>

              <div className="mb-3 mt-2">
                <label className="form-label" htmlFor="accountName">
                  Account Name
                </label>
                <input
                  type="text"
                  readOnly
                  className="form-control cus-form-control rounded-2"
                  id="accountName"
                  placeholder="account name"
                  value={dva.accountName}
                />
              </div>

              <div className="mb-3 mt-2">
                <label className="form-label" htmlFor="accountNumber">
                  Account Number
                </label>
                <input
                  type="text"
                  readOnly
                  className="form-control cus-form-control rounded-2"
                  id="accountNumber"
                  placeholder="account number"
                  value={dva.accountNumber}
                />
              </div>
            </div>

            <div className="col-md-12 d-flex justify-content-between my-3">
              <button
                type="button"
                disabled
                onClick={() => deleteDva(dva)}
                className="btn-dash bg-danger text-white border-0"
              >
                <CloseSquare size={20} />
                {isDeleteLoading ? <Loader /> : "Delete"}
              </button>

              <button
                type="submit"
                disabled
                className="btn-dash btn-primary border-0"
              >
                <TickSquare size={20} />
                {isLoading ? <Loader /> : "Update Dva"}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditDva;
