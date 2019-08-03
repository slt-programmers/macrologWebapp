import { Gender } from './gender';

export class UserSettings {

    public name: string;
    public gender: Gender;
    public birthday: string;
    public height: number;
    public currentWeight: number;
    public activity: number;

    public goalProtein: number;
    public goalFat: number;
    public goalCarbs: number;

    constructor() {}
}
