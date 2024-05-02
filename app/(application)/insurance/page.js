"use client";

import Siderbar from "@/app/_components/sidebar";
import { useState } from "react";
import Insurance from "@/app/_components/insurance/insurance";
import EditInsurance from "@/app/_components/insurance/edit_insurance";
import NewInsurance from "@/app/_components/insurance/new_insurance";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import NeedAuth from "@/app/_components/need_auth";

const InsurancePage = () => {
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [newInsurance, setNewInsurance] = useState(false);
  const { authUser } = useAuth();

  const handleSelectedInsurance = (insure) => setSelectedInsurance(insure);

  const handleNewInsurance = (insure) => setNewInsurance(insure);

  if (!authUser) return <NeedAuth />;

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
