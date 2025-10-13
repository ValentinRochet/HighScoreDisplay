const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Opening page...');
    await page.goto('file:///D:/Developpement/HighScoreDisplay/src/index.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('Taking initial screenshot...');
    await page.screenshot({ path: 'docs/screenshots/initial.png', fullPage: true });

    // Clear localStorage to ensure fresh start
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    console.log('Adding a score...');
    await page.click('.add-score-btn');
    await page.waitForSelector('#popup', { state: 'visible' });
    await page.fill('#playerName', 'TestPlayer');
    await page.fill('#playerScore', '12345');
    await page.click('#popup button[type="submit"]');
    await page.waitForSelector('#popup', { state: 'hidden' });
    await page.waitForTimeout(2000);

    console.log('Taking after-add screenshot...');
    await page.screenshot({ path: 'docs/screenshots/after-add.png', fullPage: true });

    // Check localStorage
    const data = await page.evaluate(() => localStorage.getItem('highScoreData'));
    console.log('LocalStorage:', data);

    // Check DOM
    const items = await page.$$eval('.score-item', rows =>
      rows.slice(0, 3).map((row, i) => ({
        index: i,
        ranking: row.querySelector('.ranking')?.textContent?.trim(),
        name: row.querySelector('.player-name')?.textContent?.trim(),
        score: row.querySelector('.score')?.textContent?.trim()
      }))
    );
    console.log('First 3 DOM items:', JSON.stringify(items, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();