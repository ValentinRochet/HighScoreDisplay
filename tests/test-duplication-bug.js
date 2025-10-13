const { firefox } = require('playwright');

(async () => {
  // Launch Firefox browser
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('1. Opening the page...');
    await page.goto('file:///D:/Developpement/HighScoreDisplay/src/index.html');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('2. Taking initial screenshot (should show empty scores)...');
    await page.screenshot({ path: '/d/Developpement/HighScoreDisplay/docs/screenshots/step1-initial.png', fullPage: true });

    console.log('3. Adding a single score...');

    // Click the PRESS START button
    await page.click('button:has-text("PRESS START")');

    // Wait for the popup to appear
    await page.waitForSelector('#popup', { state: 'visible' });

    // Fill in the form
    await page.fill('#playerName', 'TestPlayer');
    await page.fill('#playerScore', '12345');

    // Click Ajouter (Add)
    await page.click('#popup button:has-text("Ajouter")');

    // Wait for popup to close and animations to complete
    await page.waitForSelector('#popup', { state: 'hidden' });
    await page.waitForTimeout(2000); // Wait for animations

    console.log('4. Taking screenshot after adding score...');
    await page.screenshot({ path: '/d/Developpement/HighScoreDisplay/docs/screenshots/step2-after-add.png', fullPage: true });

    console.log('5. Checking localStorage data...');
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('highScoreData');
    });

    console.log('LocalStorage data:', localStorageData);

    // Parse and display the data structure
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      console.log('Parsed scores:', JSON.stringify(parsedData.scores, null, 2));
    }

    console.log('6. Checking DOM content...');
    const scoreRows = await page.$$eval('.score-item', rows => {
      return rows.map((row, index) => {
        const ranking = row.querySelector('.ranking')?.textContent?.trim();
        const name = row.querySelector('.player-name')?.textContent?.trim();
        const score = row.querySelector('.score')?.textContent?.trim();
        return { row: index + 1, ranking, name, score };
      });
    });

    console.log('DOM score rows:', JSON.stringify(scoreRows, null, 2));

    console.log('Test completed. Check the screenshots and console output above.');

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Keep browser open for manual inspection
    console.log('Browser will remain open for manual inspection. Close it manually when done.');
    // await browser.close();
  }
})();