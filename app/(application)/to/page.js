"use client";

import Siderbar from "@/app/_components/sidebar";
import { useEffect, useState } from "react";
import To from "@/app/_components/to/to";
import EditTo from "@/app/_components/to/edit_to";
import NewTo from "@/app/_components/to/new_to";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import NeedAuth from "@/app/_components/need_auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import { toast } from "react-toastify";
import NeedAccess from "@/app/_components/need_access";

const ToPage = () => {
  const [selectedTo, setSelectedTo] = useState(null);
  const [newTo, setNewTo] = useState(false);
  const { authUser } = useAuth();
  const [user, setUser] = useState(null);

  const handleSelectedTo = (insure) => setSelectedTo(insure);

  const handleNewTo = (insure) => setNewTo(insure);

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

      <To selectedTo={handleSelectedTo} newTo={handleNewTo} />

      {selectedTo && (
        <EditTo to={selectedTo} onHide={() => setSelectedTo(null)} />
      )}

      {newTo && <NewTo newTo={newTo} onHide={() => setNewTo(null)} />}
    </>
  );
};

export default ToPage;
