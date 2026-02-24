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
function getFormatedStringFromDays(numberOfDays) {
    var years = Math.floor(numberOfDays / 365);
    var months = Math.floor(numberOfDays % 365 / 30);
    var days = Math.floor(numberOfDays % 365 % 30);

    var yearsDisplay = years > 0 ? years + (years == 1 ? " year, " : " years, ") : "";
    var monthsDisplay = months > 0 ? months + (months == 1 ? " month, " : " months, ") : "";
    var daysDisplay = days > 0 ? days + (days == 1 ? " day" : " days") : "";
    return yearsDisplay + monthsDisplay + daysDisplay; 
}
test('Verify differences between patent filing, publication, and grant dates_2', async ({ page }) => {


  const searchKey = process.env.SEARCH_KEY;

  if (!searchKey) {
    throw new Error('SEARCH_KEY is required. Example: set SEARCH_KEY=rop && npx playwright test');
  }
  await page.goto('https://patinformed.wipo.int/');

  const searchBox = page.locator('(//input[@type="text"])[1]');
  await searchBox.pressSequentially(searchKey);
//popup
try {
  const accept = page.locator('//button[text()="I have read and agree to the terms"]');
  await accept.waitFor({ state: 'visible', timeout: 5000 });
  await accept.click();
} catch (e) {
  console.log('Element is not visible');
}


   // Wait for results 
  const results = page.locator('div[class="title cropper"]').nth(1);

  const count = await results.count();

  if (count === 0) {
    console.log(`No results found for keyword: ${searchKey}`);
    return;
    
  }
  // Click first result 
  await results.click({ timeout: 30000 }, { force: true });

  //get date text
  let publicationtext = await page.locator('(//table[@class="patentDetails noBorder"])[2]/tr[3]/td[2]').textContent()
  console.log(publicationtext)
  let filingtext = await page.locator('(//span[text()="2003-08-08 (23 years ago)"])[2]').textContent()
  console.log(filingtext)
  let granttext = await page.locator('(//table[@class="patentDetails noBorder"])[2]/tr[5]/td[2]').textContent()
  console.log(granttext)

  //convert text to date

  const publicationDate = parseDate(publicationtext);
   console.log(publicationDate)
  const filingDate = parseDate(filingtext);
  const grantDate = parseDate(granttext);

  console.log(`Publication date: ${formatDate(publicationDate)}`);
  console.log(`Grant date: ${formatDate(grantDate)}`);
  console.log(`Filing date: ${formatDate(filingDate)}`);

  //difference between two dates
  // console.log(`Difference between Publication date and Grant date are ${daysBetween(publicationDate, grantDate)} days`);
  // console.log(`Difference between Publication date and Filing date are ${daysBetween(publicationDate, filingDate)} days`);
  // console.log(`Difference between Grant date and Filing date are ${daysBetween(grantDate, filingDate)} days`);
  const pgDays = daysBetween(publicationDate, grantDate);
 console.log(pgDays)
  const pfDays = daysBetween(publicationDate, filingDate);
  console.log(pfDays)
  const gfDays = daysBetween(grantDate, filingDate);
  console.log(gfDays)

  console.log(`Difference between Publication and Grant: ${getFormatedStringFromDays(pgDays)}`);
  console.log(`Difference between Publication and Filing: ${getFormatedStringFromDays(pfDays)}`);
  console.log(`Difference between Grant and Filing: ${getFormatedStringFromDays(gfDays)}`);

});