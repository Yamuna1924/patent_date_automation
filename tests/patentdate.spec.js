import { test } from '@playwright/test';

function parseDate(text) {
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  if (!match) throw new Error('Invalid date text: ' + text);
  return new Date(match[0]);
}
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function daysBetween(d1, d2) {
  return Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
}

test('Verify differences between patent filing, publication, and grant dates', async ({ page }) => {


  const searchKey = process.env.SEARCH_KEY;

  if (!searchKey) {
    throw new Error('SEARCH_KEY is required. Example: set SEARCH_KEY=rop && npx playwright test');
  }
  await page.goto('https://patinformed.wipo.int/');

  const searchBox = page.locator('(//input[@type="text"])[1]');
  await searchBox.pressSequentially(searchKey);
//popup
  const accept = page.locator('//button[text()="I have read and agree to the terms"]');
  await accept.click().catch(() => console.log('Element is not visible'));


  await page.locator('div[class="title cropper"]').nth(1).click({ timeout: 30000 }, { force: true })


  //get date text
  let publicationtext = await page.locator('(//table[@class="patentDetails noBorder"])[2]/tr[3]/td[2]').textContent()
  console.log(publicationtext)
  let filingtext = await page.locator('(//span[text()="2003-08-08 (23 years ago)"])[2]').textContent()
  console.log(filingtext)
  let granttext = await page.locator('(//table[@class="patentDetails noBorder"])[2]/tr[5]/td[2]').textContent()
  console.log(granttext)

  //convert text to date

  const publicationDate = parseDate(publicationtext);
  const filingDate = parseDate(filingtext);
  const grantDate = parseDate(granttext);

  console.log(`Publication date: ${formatDate(publicationDate)}`);
  console.log(`Grant date: ${formatDate(grantDate)}`);
  console.log(`Filing date: ${formatDate(filingDate)}`);

  //difference between two dates
  console.log(`Difference between Publication and Grant: ${daysBetween(publicationDate, grantDate)} days`);
  console.log(`Difference between Publication and Filing: ${daysBetween(publicationDate, filingDate)} days`);
  console.log(`Difference between Grant and Filing: ${daysBetween(grantDate, filingDate)} days`);

});