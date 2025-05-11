"use client";

import { verifyPaystackTransaction } from "@/app/actions/actions";
import { InfoCircle, Timer, Verify } from "iconsax-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Timestamp,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PaymentStatus = () => {
  const [isSuccess, setIsSuccess] = useState(null);
  const searchQ = useSearchParams();
  const ref = searchQ.get("reference");

  useEffect(() => {
    if (ref) {
      verifyPaystackTransaction({
        ref: ref,
      })
        .then((res) => {
          if (res.status === true && res.data.status === "success") {
            setIsSuccess(true);
            onAddPayment(ref, res.data.metadata);
          } else {
            setIsSuccess(false);
          }
        })
        .catch((e) => {
          toast.error(`Error occurred: ${e.message}`, {
            className: "text-danger",
          });
        });
    }
  }, [ref]);

  const onAddPayment = (ref, metadata) => {
    const collRef = collection(db, "transactions");

    const userDoc = {
      transID: ref,
      tp: metadata.tp,
      to: metadata.to,
      amount: metadata.amount,
      holder: metadata.holder,
      commence:
        metadata.commence !== null
          ? Timestamp.fromDate(new Date(metadata.commence))
          : null,
      expiry:
        metadata.expiry !== null
          ? Timestamp.fromDate(new Date(metadata.expiry))
          : null,
      split: {
        govrn: metadata.split.govrn,
        broker: metadata.split.broker,
        northwave: metadata.split.northwave,
      },
      insurance: {
        id: metadata.insurance.id,
        name: metadata.insurance.name,
        type: metadata.insurance.type,
      },
      createdOn: serverTimestamp(),
    };

    setDoc(doc(collRef, ref), userDoc)
      .then(() => {
        updateDoc(doc(db, "transactions", "info"), {
          total: metadata.total,
          totalPaid: metadata.totalPaid,
          "split.govrn": metadata.totalSplitGovrn,
          "split.broker": metadata.totalSplitBroker,
          "split.northwave": metadata.totalSplitNorthwave,
        })
          .then(() => {})
          .catch((e) => {
            toast.error(`Error occured: ${e.message}`, {
              className: "text-danger",
            });
          });
      })
      .catch((e) => {
        toast.error(`Error occured: ${e.message}`, {
          className: "text-danger",
        });
      });
  };

  if (isSuccess === true) {
    return (
      <div className="container">
        <div className="row justify-content-center vh-100 align-items-center">
          <div className="col-12 text-center text-success">
            <Verify size={150} />

            <h4 className="mt-5">Payment completed Successfully</h4>

            <Link href="/payment" className="btn btn-success mt-4">
              Dashboard
            </Link>
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

            <h4 className="mt-5">Payment Cancelled or Unsuccessful</h4>

            <Link href="/payment" className="btn btn-danget mt-4">
              Dashboard
            </Link>
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

          <h4 className="mt-5">Waiting Payment Verification</h4>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
