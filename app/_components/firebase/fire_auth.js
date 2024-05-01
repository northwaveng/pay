"use client";

import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "@/app/_components/firebase/fire_config";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const formatAuthUser = (user) => ({ uid: user.uid, email: user.email });

const useFireAuth = () => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setIsLoading] = useState(true);

  const authStateChanged = async (authState) => {
    if (!authState) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setIsLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setIsLoading(true);
  };

  const signIn = async (email, password) =>
    await signInWithEmailAndPassword(auth, email, password)

  const signUp = async (email, password) =>
    await createUserWithEmailAndPassword(auth, email, password);

  const logOut = async () => {
    await signOut(auth).then(clear);
    Cookies.remove("PayNWSignedIn");
    toast.dark("Admin logged out.");
    if (typeof window !== "undefined") window.location = "/";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return { authUser, loading, signIn, signUp, logOut };
};

export default useFireAuth;
