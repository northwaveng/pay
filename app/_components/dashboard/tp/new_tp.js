"use client";

import { InfoCircle, TickSquare } from "iconsax-react";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useState } from "react";
import Loader from "@/app/_components/loader";
import { toast } from "react-toastify";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import * as states from "nigerian-states-and-lgas";
import { selectFormStyle, selectFormTheme } from "@/app/_utils/input_style";
import ReactSelect from "react-select";
import capitalize from "@/app/_utils/capitalize";
import { v4 } from "uuid";

const NewTp = ({ newTp, onHide }) => {
  const [show, setShow] = useState(!!newTp);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [nin, setNIN] = useState(null);
  const [driverLicense, setDriverLicense] = useState(null);
  const [vin, setVin] = useState(null);
  const [chasis, setChasis] = useState(null);

  const onAddTp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const id = v4();
    const collRef = collection(db, "users");
    const userDoc = {
      name: name.toLowerCase(),
      email: email.length <= 0 ? id : email.toLowerCase(),
      location: location.toLowerCase(),
      phoneNumber: phoneNumber.toLowerCase(),
      nin: nin,
      driverLicense: driverLicense,
      vin: vin,
      chasis: chasis,
      isTaxPayer: true,
      isSupervisor: false,
      isTaxOfficer: false,
      hasPassword: false,
      state: state.state.toLowerCase(),
      lga: lga.toLowerCase(),
      createdOn: serverTimestamp(),
    };

    setDoc(doc(collRef, email.length <= 0 ? id : email.toLowerCase()), userDoc)
      .then(() => {
        handleClose();
        toast.dark("Tax Payer added successfully");
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
    <Modal scrollable size="lg" show={show} onHide={handleClose}>
      <Modal.Header className="py-2" closeButton>
        <Modal.Title className="h5">New Tax Payer</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 m-0">
        <div className="container-fluid">
          <form className="row" onSubmit={onAddTp}>
            <div className="col-md-6">
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
                  Email <span className="text-primary">(optional)</span>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="contactedChannelTooltip">
                        <div className="text-start">
                          If left empty, an auto id will be generated to replace
                          the email field which can not be{" "}
                          <b className="text-primary">UNDONE</b>
                        </div>
                      </Tooltip>
                    }
                  >
                    <InfoCircle
                      size={14}
                      className="text-primary ms-1 pe-active"
                    />
                  </OverlayTrigger>
                </label>
                <input
                  type="email"
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

              <div>
                <label className="form-label" htmlFor="location">
                  Address
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
            </div>

            <div className="col-md-6">
              <div className="col-12 mt-2 mb-3">
                <div className="row">
                  <div className="col-6">
                    <label className="form-label" htmlFor="state">
                      State
                    </label>
                    <ReactSelect
                      required
                      id="state"
                      placeholder="eg: Abia"
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
                      required
                      isDisabled={state.length <= 0}
                      id="lga"
                      placeholder="eg: Aba North"
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
                      required
                      className="form-control cus-form-control rounded-2"
                      id="vin"
                      placeholder="eg: 0000000000"
                      onChange={(e) => setVin(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label" htmlFor="chasis">
                      Chasis
                    </label>
                    <input
                      type="text"
                      required
                      className="form-control cus-form-control rounded-2"
                      id="chasis"
                      placeholder="eg: 0000000000"
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
                {isLoading ? <Loader /> : "New Tax Payer"}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NewTp;
