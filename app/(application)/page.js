"use client";

import Siderbar from "@/app/_components/sidebar";
import { useEffect } from "react";
import { useAuth } from "@/app/_components/firebase/fire_auth_context";
import { useRouter } from "next/navigation";
import Loader from "@/app/_components/loader";
// import Dashboard from "@/app/_components/dashboard/dashboard";

const Pay = () => {
  const { loading, authUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (authUser) router.push("/");
      else router.push("/signin");
    }
  }, [loading, authUser, router]);

  if (authUser) {
    return (
      <>
        <Siderbar />
        {/* <Dashboard /> */}
      </>
    );
  }

  return <Loader fullHeight={true} />;
};

export default Pay;
