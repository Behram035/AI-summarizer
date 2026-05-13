"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "../../store/slices/authSlice";
import Navbar from "./Navbar";
import AuthModal from "../../components/ui/AuthModal";

export default function AppShell({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <AuthModal />
    </div>
  );
}
