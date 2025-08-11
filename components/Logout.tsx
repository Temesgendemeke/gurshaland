"use client";
import React from "react";
import { Button } from "./ui/button";
import { logout } from "@/actions/auth";
import { LogOut } from "lucide-react";

const Logout = () => {
  return (
    <Button variant={"ghost"} onClick={logout} className="w-full justify-start">
      {" "}
      <LogOut /> Logout
    </Button>
  );
};

export default Logout;
