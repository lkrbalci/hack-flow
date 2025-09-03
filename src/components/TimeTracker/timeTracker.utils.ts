export function useDefaultTimeTrackerValues() {
  return {
    startDate: new Date().toISOString().split("T")[0],
    startTime: "00:00",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endTime: "23:59",
    timezone: "UTC",
  };
}
