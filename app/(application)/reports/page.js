"use client";

import Siderbar from "@/app/_components/sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import NeedAuth from "@/app/_components/need_auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/_components/firebase/fire_config";
import { toast } from "react-toastify";
import NeedAccess from "@/app/_components/need_access";

const ReportsPage = () => {
  const { authUser } = useAuth();
  const [user, setUser] = useState(null);

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
    </>
  );
};

export default ReportsPage;
