export interface Tracking {
  height: string;
  weight: string;
  bmi: string;
  bmiCategory: string;
  updatedDate: string;
}

export default interface DailyTracking {
  [date: string]: Tracking;
}

export interface TrackingRecord {
  [_id: string]: DailyTracking;
}
