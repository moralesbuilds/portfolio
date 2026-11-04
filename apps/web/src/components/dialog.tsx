"use client";

import { useTranslations } from "next-intl";
import { CloseIcon } from "./icons";

type DialogProps = {
  id: string;
  title: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
};

export function Dialog({ id, title, onClose, children }: DialogProps) {
  const t = useTranslations("root");

  return (
    <dialog id={id} className="backdrop:bg-slate-900/50" onClose={onClose}>

      {/* Modal Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <form method="dialog">
          <button
            type="submit"
            aria-label={t("close_modal")}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            data-testid="button-close-dialog"
          >
            <CloseIcon />
          </button>
        </form>
      </div>

      {/* Modal Content */}
      <div className="py-6 flex-1 sm:flex-none overflow-y-auto min-w-0">
        {children}
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end pt-4 border-t border-slate-200 shrink-0 mt-auto sm:mt-0">
        <form method="dialog">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            data-testid="button-close-footer"
          >
            {t("close")}
          </button>
        </form>
      </div>

    </dialog>
  );
}
