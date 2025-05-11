"use client";

import { Copy, TickSquare } from "iconsax-react";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import capitalize from "@/app/_utils/capitalize";
import PhoneInput from "react-phone-number-input";
import copyToClipboard from "@/app/_utils/copy_clipboard";

const EditDva = ({ dva, onHide }) => {
  const [show, setShow] = useState(!!dva);

  const onUpdateDva = async (e) => {
    e.preventDefault();
    toast.info("You can not update DVA information!");
  };

  const copyDva = () => {
    copyToClipboard(
      `Bank: ${dva.bankName}\nAccount Name: ${dva.accountName}\nAccount Number: ${dva.accountNumber}`,
      "DVA copied!"
    );
  };

  const handleClose = () => {
    setShow(false);
    if (onHide) onHide();
  };

  return (
    <Modal scrollable show={show} onHide={handleClose}>
      <Modal.Header className="py-2" closeButton>
        <Modal.Title className="h5">
          {capitalize(dva.accountName.replaceAll("-", " "))}
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
                  value={capitalize(dva.bankName)}
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
                  value={capitalize(dva.accountName.replaceAll("-", " "))}
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

              <div className="mb-3 mt-2">
                <label className="form-label" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <PhoneInput
                  id="phoneNumber"
                  placeholder="e.g., +2348000000000"
                  value={dva.phoneNumber}
                  defaultCountry="NG"
                  international
                  readOnly
                  className="form-control cus-form-control rounded-2"
                />
              </div>
            </div>

            <div className="col-md-12 d-flex justify-content-between my-3">
              <button
                type="button"
                onClick={() => copyDva(dva)}
                className="btn-dash bg-success text-white border-0"
              >
                <Copy size={20} />
                Copy
              </button>

              <button type="submit" className="btn-dash btn-primary border-0">
                <TickSquare size={20} />
                Update Dva
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditDva;
