"use client";

import { useState } from "react";

type SheetType = "task" | "project" | "time-tracker" | null;

export function useSheetManager() {
  const [sheet, setSheet] = useState<{
    open: boolean;
    type: SheetType;
  }>({
    open: false,
    type: null,
  });

  const openSheet = (type: SheetType) => {
    if (type === null) return;
    setSheet({ open: true, type });
  };

  const closeSheet = () => {
    setSheet({ open: false, type: null });
  };

  return {
    sheet,
    openSheet,
    closeSheet,
  };
}
