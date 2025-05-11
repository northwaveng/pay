"use client";

import { useEffect, useState } from "react";
import Dva from "@/app/_components/dvas/dvas";
import EditDva from "@/app/_components/dvas/edit_dva";
import NewDva from "@/app/_components/dvas/new_dva";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import NeedAuth from "@/app/_components/need_auth";
import { db } from "@/app/_components/firebase/fire_config";
import { doc, onSnapshot } from "firebase/firestore";
import NeedAccess from "@/app/_components/need_access";

const DvaPage = () => {
  const [selectedDva, setSelectedDva] = useState(null);
  const [newDva, setNewDva] = useState(false);
  const { authUser } = useAuth();
  const [user, setUser] = useState(null);

  const handleSelectedDva = (dva) => setSelectedDva(dva);

  const handleNewDva = (dva) => setNewDva(dva);

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
      <Dva selectedDva={handleSelectedDva} newDva={handleNewDva} />

      {selectedDva && (
        <EditDva dva={selectedDva} onHide={() => setSelectedDva(null)} />
      )}

      {newDva && <NewDva newDva={newDva} onHide={() => setNewDva(null)} />}
    </>
  );
};

export default DvaPage;
