"use client";

import Siderbar from "@/app/_components/sidebar";
import { useEffect, useState } from "react";
import Payment from "@/app/_components/payment/payment";
import EditPayment from "@/app/_components/payment/edit_payment";
import NewPayment from "@/app/_components/payment/new_payment";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import NeedAuth from "@/app/_components/need_auth";
import { db } from "@/app/_components/firebase/fire_config";
import { doc, onSnapshot } from "firebase/firestore";
import NeedAccess from "@/app/_components/need_access";

const PaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newPayment, setNewPayment] = useState(false);
  const { authUser } = useAuth();
  const [user, setUser] = useState(null);

  const handleSelectedPayment = (pay) => setSelectedPayment(pay);

  const handleNewPayment = (pay) => setNewPayment(pay);

  useEffect(() => {
    if (authUser) {
      const userRef = doc(db, "users", authUser.email);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) setUser(doc.data());
        else toast.error("Account not found");
      });
      return () => unsubscribe();
    }
  }, [authUser]);

  if (!authUser) return <NeedAuth />;

  if (user && !user.isTaxOfficer) return <NeedAccess />;
  return (
    <>
      <Siderbar />

      <Payment
        selectedPayment={handleSelectedPayment}
        newPayment={handleNewPayment}
      />

      {selectedPayment && (
        <EditPayment
          payment={selectedPayment}
          onHide={() => setSelectedPayment(null)}
        />
      )}

      {newPayment && (
        <NewPayment
          newPayment={newPayment}
          onHide={() => setNewPayment(null)}
        />
      )}
    </>
  );
};

export default PaymentPage;
