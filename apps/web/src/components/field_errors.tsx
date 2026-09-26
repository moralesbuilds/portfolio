import { WarningIcon } from "./icons";

type FieldErrorsProps = {
  id: string;
  errors?: string[] | null;
};

export function FieldErrors({ id, errors }: FieldErrorsProps) {
  const hasErrors = (errors?.length ?? 0) > 0;
  return hasErrors ? (
    <div id={id} aria-live="polite" className="space-y-1 pt-0.5">
      {errors!.map((e) => (
        <p key={e} className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <WarningIcon />
          <span>{e}</span>
        </p>
      ))}
    </div>
  ) : null;
}
