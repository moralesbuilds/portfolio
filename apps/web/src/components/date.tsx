import React from "react";
import { toLocalDate } from "@/utils/date";

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
