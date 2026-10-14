import { toLocalDate } from "@/lib/format";
import React from "react";

interface DateProps extends React.TimeHTMLAttributes<HTMLTimeElement> {
  value: string;
};

export function Date({ value, ...rest }: DateProps) {
  const displayValue = toLocalDate(value);

  return (
    <time dateTime={value} {...rest}>
      {displayValue}
    </time>
  );
}
