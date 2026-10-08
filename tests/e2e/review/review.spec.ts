import { test, expect } from '@playwright/test';
import { ReviewPage } from '@/tests/page-objects/ReviewPage';

test('create a review without an image', async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    const text = 'This is a test review'
    
    await page.goto('/reviews');
    await reviewPage.createReview(text);
    await expect(page.getByRole('main')).toContainText(text);  
});

// test('create a review with an image', async ({ page }) => {
//     const reviewPage = new ReviewPage(page);
//     const text = 'This is a test review'
//     const imagePath = 'public/img1.png'

//     await page.goto('/reviews');
//     await reviewPage.createReviewWithImage(text, imagePath);
//     await expect(page.getByRole('main')).toContainText(text);
// });