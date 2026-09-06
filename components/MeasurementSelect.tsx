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
  const val = form.watch(name);

  return (
    <Select
      onValueChange={(value) =>
        form.setValue(name, value, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
      value={val || undefined}
    >
      <SelectTrigger className="w-[11.25rem]">
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
