import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import measurements from "@/constants/measurements";
import { UseFormReturn } from "react-hook-form";

interface MeasurementSelectProps {
  form: UseFormReturn<any>;
  name: string;
}

const MeasurementSelect = ({ form, name }: MeasurementSelectProps) => {
  return (
    <Select
      defaultValue="g"
      onValueChange={(value) => form.setValue(name, value)}
      value={form.watch(name) || ""}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select measurement" />
      </SelectTrigger>
      <SelectContent>
        {measurements.map((measurement) => (
          <SelectItem key={measurement.code} value={measurement.code}>
            {measurement.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MeasurementSelect;
