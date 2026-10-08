import { test, expect } from '@/tests/fixtures/date-fixtures';
import { CalendarPage } from '@/tests/page-objects/CalendarPage';

test('create availability', async ({ page, loggedInAdmin, testDates }) => {
    page = loggedInAdmin.page
    const calendarPage = new CalendarPage(page);
    
    // Use formatted date for UI ("January 15, 2024")
    await calendarPage.createAvailability(testDates.nextWeekFormatted, testDates.randomTime);
    await expect(page.getByRole('button', { name: testDates.randomTime })).toBeVisible();
});

test('book appointment', async ({ page, loggedInUser, testDates }) => {
    page = loggedInUser.page
    await page.goto('http://localhost:4000/');
    await page.getByRole('button', { name: 'BOOK A SERVICE ▾' }).click();
    await page.getByRole('link', { name: 'WIG INSTALLATIONS' }).click();
    await page.getByRole('button', { name: 'Service Type: Closure Re-' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: testDates.nextWeekFormatted }).click();
    await page.getByRole('button').filter({ hasText: testDates.randomTime }).click();
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
    await expect(page.getByRole('main')).toContainText('Booking Complete!');  
 
});
