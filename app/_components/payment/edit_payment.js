"use client";

import { truncate } from "@/app/_utils/truncate";
import { Setting, Trash } from "iconsax-react";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Loader from "@/app/_components/loader";
import capitalize from "@/app/_utils/capitalize";
import { formatTimestamp } from "@/app/_utils/format_timestamp";
import { toNGN } from "@/app/_utils/to_currency";
import { toast } from "react-toastify";
import { verifyPaystackTransaction } from "@/app/actions/actions";
import { useRouter } from "next/navigation";

const EditPayment = ({ payment, isSupervisor = false, onHide }) => {
  const [show, setShow] = useState(!!payment);
  const [isLoading, setIsLoading] = useState(false);
  const [record, setRecord] = useState(null);
  const router = useRouter();

  useEffect(() => {
    verifyPaystackTransaction({
      ref: payment.transID,
    })
      .then((res) => setRecord(res))
      .catch((e) => {
        toast.error(`Error occurred: ${e.message}`, {
          className: "text-danger",
        });
      });
  }, []);

  const handleClose = () => {
    setShow(false);
    if (onHide) onHide();
  };

  return (
    <Modal scrollable size="lg" show={show} onHide={handleClose}>
      <Modal.Header className="py-2" closeButton>
        <Modal.Title className="h5">
          {truncate(capitalize(payment.holder), 20)}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 m-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="mt-2 mb-3">
                <label className="form-label" htmlFor="transID">
                  Transaction ID
                </label>
                <input
                  type="text"
                  disabled
                  className="form-control cus-form-control rounded-2"
                  id="transID"
                  placeholder={payment.transID}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="holder">
                  Holder
                </label>
                <input
                  type="text"
                  disabled
                  className="form-control cus-form-control rounded-2"
                  id="holder"
                  placeholder={payment.holder}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="amount">
                  Amount
                </label>
                <input
                  type="text"
                  disabled
                  className="form-control cus-form-control rounded-2"
                  id="amount"
                  placeholder={toNGN(payment.amount)}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mt-2 mb-3">
                <label className="form-label" htmlFor="commence">
                  Commence On
                </label>
                <input
                  type="text"
                  disabled
                  className="form-control cus-form-control rounded-2"
                  id="commence"
                  placeholder={formatTimestamp(payment.commence)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="expiry">
                  Expiry On
                </label>
                <input
                  type="text"
                  disabled
                  className="form-control cus-form-control rounded-2"
                  id="expiry"
                  placeholder={formatTimestamp(payment.expiry)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="insurance">
                  Insurance Type
                </label>
                <input
                  type="text"
                  disabled
                  className="form-control cus-form-control rounded-2"
                  id="insurance"
                  placeholder={capitalize(
                    `${payment.insurance.name} - ${payment.insurance.type}`
                  )}
                />
              </div>
            </div>

            {!isSupervisor ? (
              <div className="col-md-12 d-flex justify-content-end my-3">
                <button
                  disabled={isLoading}
                  onClick={() => {
                    setIsLoading(true);
                    router.push(`/generate_insurance/${payment.transID}`);
                    setIsLoading(false);
                  }}
                  className="btn-dash btn-primary border-0"
                >
                  <Setting size={20} />
                  {isLoading ? <Loader /> : "Generate Insurance"}
                </button>
              </div>
            ) : (
              <div className="col-md-12 text-center mb-3">
                <hr />
                <h5 className="text-primary">Transaction Record</h5>

                {record && record.status ? (
                  <div className="row mt-3">
                    <div className="col-md-6 text-start">
                      <ul className="list-unstyled">
                        <li>
                          <b>Channel:</b> {record.data.channel}
                        </li>

                        <li className="mt-3">
                          <b>Currency:</b> {record.data.currency}
                        </li>

                        <li className="mt-3">
                          <b>Response:</b> {record.data.gateway_response}
                        </li>

                        <li className="mt-3">
                          <b>Transaction ID:</b>{" "}
                          <span className="text-primary">
                            {record.data.reference}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="col-md-6 text-start">
                      <ul className="list-unstyled">
                        <li>
                          <b>Authorized Code:</b>{" "}
                          {record.data.authorization.authorization_code}
                        </li>

                        <li className="mt-3">
                          <b>Card:</b> {record.data.authorization.bin}xxxxxx
                          {record.data.authorization.last4}
                        </li>

                        <li className="mt-3">
                          <b>Card Brand:</b> {record.data.authorization.brand}
                        </li>

                        <li className="mt-3">
                          <b>Signature:</b>{" "}
                          {record.data.authorization.signature}
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted">
                    <Trash size={50} className="mt-3 mb-2" />
                    <p>No transaction record available!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditPayment;
