"use client";

import Siderbar from "@/app/_components/sidebar";
import { useState } from "react";
import To from "@/app/_components/to/to";
import EditTo from "@/app/_components/to/edit_to";
import NewTo from "@/app/_components/to/new_to";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import NeedAuth from "@/app/_components/need_auth";

const ToPage = () => {
  const [selectedTo, setSelectedTo] = useState(null);
  const [newTo, setNewTo] = useState(false);
  const { authUser } = useAuth();

  const handleSelectedTo = (insure) => setSelectedTo(insure);

  const handleNewTo = (insure) => setNewTo(insure);

  if (!authUser) return <NeedAuth />;

  return (
    <>
      <Siderbar />

      <To
        selectedTo={handleSelectedTo}
        newTo={handleNewTo}
      />

      {selectedTo && (
        <EditTo
          to={selectedTo}
          onHide={() => setSelectedTo(null)}
        />
      )}

      {newTo && (
        <NewTo
          newTo={newTo}
          onHide={() => setNewTo(null)}
        />
      )}
    </>
  );
};

export default ToPage;
