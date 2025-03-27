import { TrackingRecord, Tracking } from '../models/Tracking.model';

export const extractStatsByDate = (data: TrackingRecord) => {
  const statsByDate: { [date: string]: Tracking[] } = {};

  Object.keys(data).forEach((id) => {
    const dailyTracking = data[id];
    Object.keys(dailyTracking).forEach((date) => {
      if (!statsByDate[date]) {
        statsByDate[date] = [];
      }
      statsByDate[date].push({
        ...dailyTracking[date],
      });
    });
  });

  return statsByDate;
};