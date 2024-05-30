"use client";

import { verifyPaystackTransaction } from "@/app/actions/actions";
import { InfoCircle, Timer, Verify } from "iconsax-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatTimestamp } from "@/app/_utils/format_timestamp";

const GenerateInsurance = ({ params }) => {
  const [isSuccess, setIsSuccess] = useState(null);

  useEffect(() => {
    verifyPaystackTransaction({
      ref: params.ref,
    })
      .then((res) => {
        if (res.status === true && res.data.status === "success") {
          setIsSuccess(res.data);
          setTimeout(() => {
            window.print();
          }, 2500);
        } else {
          setIsSuccess(false);
        }
      })
      .catch((e) => {
        toast.error(`Error occurred: ${e.message}`, {
          className: "text-danger",
        });
      });
  }, [params]);

  if (isSuccess != null && isSuccess != false) {
    const expiry = new Date(isSuccess.metadata.expiry);
    const today = new Date();
    const hasExpired = expiry < today;

    return (
      <div className="container-fluid mt-2">
        <div className="row justify-content-center">
          <div className="col-12">
            <div
              className={`d-flex justify-content-between align-items-center ${
                hasExpired ? "text-danger" : "text-success"
              }`}
            >
              <Verify size={50} variant="Bold" />

              <h6>{hasExpired ? "EXPIRED" : "ACTIVE"}</h6>
            </div>

            <hr />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Insurance</h4>

              <img
                src={`https://barcode.orcascan.com/?type=qr&data=https://pay.northwaveng.com/generate_insurance/${isSuccess.metadata.transID}`}
                width={100}
                height={100}
                priority
                alt="QR"
              />
            </div>

            <ol>
              <li>
                Index Mark And Registration Number of Vehicle:{" "}
                <b>{isSuccess.metadata.vin}</b>
              </li>

              <li className="mt-3">
                Name of Policy Holder: <b>{isSuccess.metadata.holder}</b>
              </li>

              <li className="mt-3">
                Date of Commencement of Insurance:{" "}
                <b>{formatTimestamp(isSuccess.metadata.commence)}</b>
              </li>

              <li className="mt-3">
                Date of expiry of insurance:{" "}
                <b>{formatTimestamp(isSuccess.metadata.expiry)}</b>
              </li>

              <li className="mt-3">
                Persons or classes of persons entitled to drive
                <ul>
                  <li>The Policy holder</li>

                  <li>
                    The policy holder may also drive a Motor car not belonging
                    to him and not hired to him under a hire-purchase agreement.
                  </li>

                  <li>
                    Any other person who is driving on the policy holder&apos;s order
                    or with his permission.
                  </li>

                  <li>
                    Provided that the person driving is permitted in accordance
                    with the licensing or others laws or regulations to drive
                    the Motor Car or has been permitted and is not. disqualified
                    by order of a court of law or by reason of any enactment or
                    regulation in that behalf from driving such Motor Car.
                  </li>
                </ul>
              </li>

              <li className="mt-3">
                Limitations as to use
                <ul>
                  <li>
                    Use only for social, domestic and pleasure purpose and for
                    the Policy holder&apos;s business.
                  </li>

                  <li>
                    The Policy does not cover use for hire or reward or for
                    racing or pace-making reliability trial speed-testing or use
                    for purpose in connection with the Motor. Trade.
                  </li>
                </ul>
              </li>
            </ol>

            <div className="text-center">
              <h2 className="fw-bold">
                {`${isSuccess.metadata.insurance.name} - ${isSuccess.metadata.insurance.type}`.toUpperCase()}
              </h2>

              <h5>{isSuccess.metadata.vName.toUpperCase()}</h5>

              <p>Check the Authencity of your Policy from www.askniid.org</p>
              <i>
                I/WE hereby certify that this coverage Note is issued in
                accordance with the provisions of the Motor Vehicles (Third
                Party Insurance) ordinance 1945 (Nigeria)
              </i>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-5">
              <div>
                <b>Examined By</b>

                <div
                  className="mt-5"
                  style={{ borderBottom: "1px solid black", width: 200 }}
                />
              </div>

              <div>
                <b>Approved By</b>

                <div
                  className="mt-5"
                  style={{ borderBottom: "1px solid black", width: 200 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess === false) {
    return (
      <div className="container">
        <div className="row justify-content-center vh-100 align-items-center">
          <div className="col-12 text-center text-danger">
            <InfoCircle size={150} />

            <h4 className="mt-5">Invalid Link</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center vh-100 align-items-center">
        <div className="col-12 text-center text-warning">
          <Timer size={150} />

          <h4 className="mt-5">Waiting Verification</h4>
        </div>
      </div>
    </div>
  );
};

export default GenerateInsurance;
