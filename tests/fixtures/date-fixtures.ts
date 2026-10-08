import { test as base } from './auth-fixtures';
import { DateGenerator } from '../utils/date-generator';

type DateFixtures = {
  testDates: {
    tomorrow: string;
    nextWeek: string;
    twoWeeks: string;
    tomorrowFormatted: string;
    nextWeekFormatted: string;
    twoWeeksFormatted: string;
    randomTime: string;
    allTimeSlots: string[];
  };
};

export const test = base.extend<DateFixtures>({
  testDates: async ({}, use) => {
    const rawDates = {
      tomorrow: DateGenerator.getNextWeekday(1),
      nextWeek: DateGenerator.getNextWeekday(7),
      twoWeeks: DateGenerator.getNextWeekday(14)
    };
    
    const dates = {
      tomorrow: rawDates.tomorrow,
      nextWeek: rawDates.nextWeek,
      twoWeeks: rawDates.twoWeeks,
      tomorrowFormatted: DateGenerator.getFormattedDate(rawDates.tomorrow),
      nextWeekFormatted: DateGenerator.getFormattedDate(rawDates.nextWeek),
      twoWeeksFormatted: DateGenerator.getFormattedDate(rawDates.twoWeeks),
      randomTime: DateGenerator.getRandomTimeSlot(),
      allTimeSlots: DateGenerator.getTimeSlots()
    };
    
    await use(dates);
  }
});

export { expect } from '@playwright/test';