"use client";

import Siderbar from "@/app/_components/sidebar";
import { useEffect, useState } from "react";
import Insurance from "@/app/_components/insurance/insurance";
import EditInsurance from "@/app/_components/insurance/edit_insurance";
import NewInsurance from "@/app/_components/insurance/new_insurance";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import NeedAuth from "@/app/_components/need_auth";
import { db } from "@/app/_components/firebase/fire_config";
import { doc, onSnapshot } from "firebase/firestore";
import NeedAccess from "@/app/_components/need_access";

const InsurancePage = () => {
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [newInsurance, setNewInsurance] = useState(false);
  const { authUser } = useAuth();
  const [user, setUser] = useState(null);

  const handleSelectedInsurance = (insure) => setSelectedInsurance(insure);

  const handleNewInsurance = (insure) => setNewInsurance(insure);

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

  if (user && !user.isSupervisor) return <NeedAccess />;
  return (
    <>
      <Siderbar />

      <Insurance
        selectedInsurance={handleSelectedInsurance}
        newInsurance={handleNewInsurance}
      />

      {selectedInsurance && (
        <EditInsurance
          insurance={selectedInsurance}
          onHide={() => setSelectedInsurance(null)}
        />
      )}

      {newInsurance && (
        <NewInsurance
          newInsurance={newInsurance}
          onHide={() => setNewInsurance(null)}
        />
      )}
    </>
  );
};

export default InsurancePage;
