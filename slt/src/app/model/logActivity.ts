export interface LogActivity {
  id: number;
  day: Date;
  name: string;
  calories: number;
  syncedWith?: string;
  syncedId?: number;

}
