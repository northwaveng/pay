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
import * as states from "nigerian-states-and-lgas";
import ReactSelect from "react-select";
import { selectFormStyle, selectFormTheme } from "@/app/_utils/input_style";

const EditTp = ({ tp, onHide }) => {
  const [show, setShow] = useState(!!tp);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [nin, setNIN] = useState(null);
  const [driverLicense, setDriverLicense] = useState(null);
  const [vin, setVin] = useState(null);
  const [chasis, setChasis] = useState(null);

  const onUpdateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    updateDoc(doc(db, "users", tp.email), {
      name: name.length > 0 ? name.toLowerCase() : tp.name,
      location: location.length > 0 ? location.toLowerCase() : tp.location,
      phoneNumber:
        phoneNumber.length > 0 ? phoneNumber.toLowerCase() : tp.phoneNumber,
      nin: nin ? nin.toLowerCase() : tp.nin,
      driverLicense: driverLicense
        ? driverLicense.toLowerCase()
        : tp.driverLicense,
      vin: vin ? vin.toLowerCase() : tp.vin,
      chasis: chasis ? chasis.toLowerCase() : tp.chasis,
      state: state.length > 0 ? state.state.toLowerCase() : tp.state,
      lga: lga.length > 0 ? lga.toLowerCase() : tp.lga,
    })
      .then(() => {
        handleClose();
        toast.dark("Tax Payer updated successfully");
      })
      .catch((e) => {
        toast.dark(`Error occured: ${e.message}`, {
          className: "text-danger",
        });
      });
  };

  const deleteTp = (tp) => {
    setIsDeleteLoading(true);

    deleteDoc(doc(db, "users", tp.email))
      .then(() => {
        handleClose();
        toast.dark("Tax Payer deleted successfully");
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
    <Modal scrollable size="lg" show={show} onHide={handleClose}>
      <Modal.Header className="py-2" closeButton>
        <Modal.Title className="h5">
          {truncate(capitalize(tp.name), 20)}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 m-0">
        <div className="container-fluid">
          <form className="row" onSubmit={onUpdateUser}>
            <div className="col-md-6">
              <div className="mb-3 mt-2">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control cus-form-control rounded-2"
                  id="name"
                  placeholder={tp.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Email / Auto ID
                </label>
                <input
                  type="email"
                  disabled
                  className="form-control cus-form-control rounded-2"
                  id="email"
                  placeholder={tp.email}
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
                  placeholder={tp.phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="location">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control cus-form-control rounded-2"
                  id="location"
                  placeholder={tp.location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="col-12 mt-2 mb-3">
                <div className="row">
                  <div className="col-6">
                    <label className="form-label" htmlFor="state">
                      State
                    </label>
                    <ReactSelect
                      id="state"
                      placeholder={capitalize(tp.state)}
                      options={states.all().map((state) => ({
                        label: capitalize(state.state),
                        value: state,
                      }))}
                      styles={selectFormStyle}
                      theme={selectFormTheme}
                      onChange={(option) => setState(option.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label" htmlFor="lga">
                      LGA
                    </label>
                    <ReactSelect
                      isDisabled={state.length <= 0}
                      id="lga"
                      placeholder={capitalize(tp.lga)}
                      options={(state.length <= 0 ? [] : state.lgas).map(
                        (lga) => ({
                          label: capitalize(lga),
                          value: lga,
                        })
                      )}
                      styles={selectFormStyle}
                      theme={selectFormTheme}
                      onChange={(option) => setLga(option.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <label className="form-label" htmlFor="vin">
                      VIN
                    </label>
                    <input
                      type="text"
                      className="form-control cus-form-control rounded-2"
                      id="vin"
                      placeholder={tp.vin}
                      onChange={(e) => setVin(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label" htmlFor="chasis">
                      Chasis
                    </label>
                    <input
                      type="text"
                      className="form-control cus-form-control rounded-2"
                      id="chasis"
                      placeholder={tp.chasis}
                      onChange={(e) => setChasis(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <label className="form-label" htmlFor="nin">
                      NIN
                    </label>
                    <input
                      type="text"
                      disabled={driverLicense && driverLicense.length > 0}
                      className="form-control cus-form-control rounded-2"
                      id="nin"
                      placeholder={tp.nin !== null ? tp.nin : "eg: 0000000000"}
                      onChange={(e) => setNIN(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label" htmlFor="driverLicense">
                      Driver License
                    </label>
                    <input
                      type="text"
                      disabled={nin && nin.length > 0}
                      className="form-control cus-form-control rounded-2"
                      id="driverLicense"
                      placeholder={
                        tp.driverLicense !== null
                          ? tp.driverLicense
                          : "eg: 0000000000"
                      }
                      onChange={(e) => setDriverLicense(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 d-flex justify-content-between my-3">
              <button
                type="button"
                disabled={isDeleteLoading}
                onClick={() => deleteTp(tp)}
                className="btn-dash bg-danger text-white border-0 me-2"
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
                {isLoading ? <Loader /> : "Update Tax Payer"}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditTp;
