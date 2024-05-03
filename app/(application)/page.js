"use client";

import Siderbar from "@/app/_components/sidebar";
import { useEffect, useState } from "react";
import Tp from "@/app/_components/dashboard/tp/tp";
import EditTp from "@/app/_components/dashboard/tp/edit_tp";
import NewTp from "@/app/_components/dashboard/tp/new_tp";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import { useRouter } from "next/navigation";
import Loader from "@/app/_components/loader";
import Dashboard from "@/app/_components/dashboard/dashboard";
import { db } from "@/app/_components/firebase/fire_config";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";

const Pay = () => {
  const [selectedTp, setSelectedTp] = useState(null);
  const [newTp, setNewTp] = useState(false);
  const { loading, authUser } = useAuth();
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleSelectedTp = (tp) => setSelectedTp(tp);

  const handleNewTp = (tp) => setNewTp(tp);

  useEffect(() => {
    if (!loading) {
      if (authUser) router.push("/");
      else router.push("/signin");
    }
  }, [loading, authUser, router]);

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

  if (authUser) {
    if (user && user.isSupervisor) {
      return (
        <>
          <Siderbar />
          <Dashboard />
        </>
      );
    } else if (user && user.isTaxOfficer) {
      return (
        <>
          <Siderbar />

          <Tp selectedTp={handleSelectedTp} newTp={handleNewTp} />

          {selectedTp && (
            <EditTp tp={selectedTp} onHide={() => setSelectedTp(null)} />
          )}

          {newTp && <NewTp newTp={newTp} onHide={() => setNewTp(null)} />}
        </>
      );
    }

    return <></>;
  }

  return <Loader fullHeight={true} />;
};

export default Pay;
