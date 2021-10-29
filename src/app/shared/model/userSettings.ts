import { Gender } from './gender';

export interface UserSettings {

  name?: string;
  gender?: Gender;
  birthday?: string;
  height?: number;
  currentWeight?: number;
  activity?: number;

  goalProtein?: number;
  goalFat?: number;
  goalCarbs?: number;

}
