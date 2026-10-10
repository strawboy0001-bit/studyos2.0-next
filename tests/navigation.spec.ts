import { test, expect } from '@playwright/test';

test.describe('StudyOS 2.0 Navigation', () => {
  test('should load the dashboard successfully', async ({ page }) => {
    await page.goto('/');
    
    // Verify Dashboard title is visible
    await expect(page.getByRole('heading', { name: 'Welcome back!' })).toBeVisible();
    
    // Verify Sidebar exists
    await expect(page.getByText('StudyOS.')).toBeVisible();
  });

  test('should navigate to My Subjects and allow creating a subject', async ({ page }) => {
    await page.goto('/');
    
    // Click on My Subjects in the sidebar
    await page.getByRole('link', { name: 'My Subjects' }).click();
    
    // Verify Subjects page loaded
    await expect(page.getByRole('heading', { name: 'My Subjects' })).toBeVisible();

    // Click Add Subject
    await page.getByRole('button', { name: 'Add Subject' }).click();

    // Fill in the subject name
    const subjectNameInput = page.getByPlaceholder('Subject Name');
    await expect(subjectNameInput).toBeVisible();
    
    await subjectNameInput.fill('Computer Science 101');
    
    // Click Save
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify the new subject is rendered on the page
    await expect(page.getByText('Computer Science 101')).toBeVisible();
  });
});
