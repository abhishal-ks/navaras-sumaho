import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Field } from "@/src/ui/basic";

export function ControlledField<TFieldValues extends FieldValues>(props: {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
}) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <Field
          label={props.label}
          value={field.value ?? ""}
          onChangeText={field.onChange}
          placeholder={props.placeholder}
          secureTextEntry={props.secureTextEntry}
        />
      )}
    />
  );
}

