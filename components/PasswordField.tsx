"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import EyeButton from "./EyeButton";

const PasswordField = (field: any) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div className="relative">
      <Input
        placeholder="enter your password"
        type={showPassword ? "text" : "password"}
        className="bg-transparent w-full h-full"
        {...field}
      />
      <EyeButton
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    </div>
  );
};

export default PasswordField;
