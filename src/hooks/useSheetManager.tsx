import { useState } from "react";

export type SheetType = "task" | "project" | "time-tracker" | null;

export interface SheetData {
  projectId?: string;
}

export function useSheetManager() {
  const [sheet, setSheet] = useState<{
    open: boolean;
    type: SheetType;
    data?: SheetData;
  }>({
    open: false,
    type: null,
    data: undefined,
  });

  const openSheet = (type: SheetType, data?: SheetData) => {
    if (type === null) return;
    setSheet({ open: true, type, data });
  };

  const closeSheet = () => {
    setSheet({ open: false, type: null, data: undefined });
  };

  return {
    sheet,
    openSheet,
    closeSheet,
  };
}
