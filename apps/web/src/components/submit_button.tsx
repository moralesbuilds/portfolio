import { Loading } from "./loading";

type SubmitButtonProps = {
  label: string;
  isSubmitting?: boolean;
};

export function SubmitButton({ label, isSubmitting = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full inline-flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isSubmitting
        ? "opacity-75 cursor-not-allowed"
        : "hover:bg-indigo-500 cursor-pointer"
      }`}
    >
      {isSubmitting ? <Loading size="sm" /> : <span>{label}</span>}
    </button>
  );
}
