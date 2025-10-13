const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('1. Opening the page...');
    await page.goto('file:///D:/Developpement/HighScoreDisplay/index.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('2. Taking initial screenshot...');
    await page.screenshot({ path: '/d/Developpement/HighScoreDisplay/docs/screenshots/debug-initial.png', fullPage: true });

    console.log('3. Adding score with debugging...');

    // Enable console logging from the page
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Click PRESS START
    await page.click('button:has-text("PRESS START")');
    await page.waitForSelector('#popup', { state: 'visible' });

    // Fill form
    await page.fill('#playerName', 'TestPlayer');
    await page.fill('#playerScore', '12345');

    console.log('4. About to submit form...');

    // Submit form and monitor what happens
    await page.click('#popup button:has-text("Ajouter")');

    console.log('5. Form submitted, waiting for popup to close...');
    await page.waitForSelector('#popup', { state: 'hidden' });

    console.log('6. Popup closed, waiting for potential animations...');
    await page.waitForTimeout(3000); // Wait longer for animations

    console.log('7. Taking screenshot after submission...');
    await page.screenshot({ path: '/d/Developpement/HighScoreDisplay/docs/screenshots/debug-after-submit.png', fullPage: true });

    console.log('8. Checking DOM state...');
    const domState = await page.evaluate(() => {
      const scoreItems = Array.from(document.querySelectorAll('.score-item'));
      return scoreItems.map((item, index) => {
        const ranking = item.querySelector('.ranking')?.textContent?.trim();
        const name = item.querySelector('.player-name')?.textContent?.trim();
        const score = item.querySelector('.score')?.textContent?.trim();
        return { row: index + 1, ranking, name, score };
      });
    });

    console.log('DOM State:', JSON.stringify(domState, null, 2));

    console.log('9. Checking localStorage again...');
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('highScoreData');
    });
    console.log('LocalStorage after submission:', localStorageData);

    // Wait longer to see if anything updates
    console.log('10. Waiting additional time to see if display updates...');
    await page.waitForTimeout(5000);

    console.log('11. Final DOM check...');
    const finalDomState = await page.evaluate(() => {
      const scoreItems = Array.from(document.querySelectorAll('.score-item'));
      return scoreItems.map((item, index) => {
        const ranking = item.querySelector('.ranking')?.textContent?.trim();
        const name = item.querySelector('.player-name')?.textContent?.trim();
        const score = item.querySelector('.score')?.textContent?.trim();
        return { row: index + 1, ranking, name, score };
      });
    });

    console.log('Final DOM State:', JSON.stringify(finalDomState, null, 2));

    console.log('12. Taking final screenshot...');
    await page.screenshot({ path: '/d/Developpement/HighScoreDisplay/docs/screenshots/debug-final.png', fullPage: true });

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    console.log('Test completed. Browser will remain open for inspection.');
    // await browser.close();
  }
})();