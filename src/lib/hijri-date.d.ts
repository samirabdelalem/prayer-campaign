declare module "hijri-date" {
  export class HijriDate {
    constructor(date: Date | string | number);
    getDate(): number;
    getMonth(): number;
    getFullYear(): number;
    getDay(): number;
    format(pattern: string): string;
    static fromGregorian(date: Date): HijriDate;
  }
}