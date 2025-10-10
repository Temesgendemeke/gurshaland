import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

interface EyeButtonProps{
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}


const EyeButton = ({ showPassword, setShowPassword} : EyeButtonProps ) => {
    return (
        <Button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute  hover:bg-transparent transform -translate-y-1/2 top-1/2 right-2" variant={'ghost'}>
            {showPassword ? <Eye /> : <EyeOff />}
        </Button>
    );
};

export default EyeButton
