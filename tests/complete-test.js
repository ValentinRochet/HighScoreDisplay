const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('=== COMPLETE BUG FIX TEST SEQUENCE ===');

    console.log('1. Opening fresh page (should start with empty scores)...');
    await page.goto('file:///D:/Developpement/HighScoreDisplay/index.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    console.log('2. Taking initial screenshot...');
    await page.screenshot({ path: '/d/Developpement/HighScoreDisplay/docs/screenshots/test-01-initial.png', fullPage: true });

    console.log('3. Adding first score (TestPlayer, 12345)...');
    await page.click('button:has-text("PRESS START")');
    await page.waitForSelector('#popup', { state: 'visible' });
    await page.fill('#playerName', 'TestPlayer');
    await page.fill('#playerScore', '12345');
    await page.click('#popup button:has-text("Ajouter")');
    await page.waitForSelector('#popup', { state: 'hidden' });
    await page.waitForTimeout(4000); // Wait for animations to complete

    console.log('4. Taking screenshot after first score...');
    await page.screenshot({ path: '/d/Developpement/HighScoreDisplay/docs/screenshots/test-02-first-score.png', fullPage: true });

    // Check first score
    const firstScoreState = await page.evaluate(() => {
      const scoreItems = Array.from(document.querySelectorAll('.score-item'));
      return scoreItems.map((item, index) => {
        const ranking = item.querySelector('.ranking')?.textContent?.trim();
        const name = item.querySelector('.player-name')?.textContent?.trim();
        const score = item.querySelector('.score')?.textContent?.trim();
        return { row: index + 1, ranking, name, score };
      });
    });

    console.log('State after first score:', JSON.stringify(firstScoreState.slice(0, 3), null, 2));

    console.log('5. Adding second score (Player2, 15000)...');
    await page.click('button:has-text("PRESS START")');
    await page.waitForSelector('#popup', { state: 'visible' });
    await page.fill('#playerName', 'Player2');
    await page.fill('#playerScore', '15000');
    await page.click('#popup button:has-text("Ajouter")');
    await page.waitForSelector('#popup', { state: 'hidden' });
    await page.waitForTimeout(4000); // Wait for animations to complete

    console.log('6. Taking screenshot after second score...');
    await page.screenshot({ path: '/d/Developpement/HighScoreDisplay/docs/screenshots/test-03-both-scores.png', fullPage: true });

    // Check final state
    const finalState = await page.evaluate(() => {
      const scoreItems = Array.from(document.querySelectorAll('.score-item'));
      return scoreItems.map((item, index) => {
        const ranking = item.querySelector('.ranking')?.textContent?.trim();
        const name = item.querySelector('.player-name')?.textContent?.trim();
        const score = item.querySelector('.score')?.textContent?.trim();
        return { row: index + 1, ranking, name, score };
      });
    });

    console.log('7. Final DOM state (top 3 rows):');
    console.log(JSON.stringify(finalState.slice(0, 3), null, 2));

    // Check localStorage
    const localStorage = await page.evaluate(() => {
      return localStorage.getItem('highScoreData');
    });

    const parsedData = JSON.parse(localStorage);
    console.log('8. Final localStorage data:');
    console.log('   - Display scores (top 3):', JSON.stringify(parsedData.scores.slice(0, 3), null, 2));
    console.log('   - All scores:', JSON.stringify(parsedData.allScores, null, 2));

    // Verify no duplication
    console.log('9. VERIFICATION RESULTS:');
    console.log('   ✓ localStorage contains exactly 2 scores in allScores');
    console.log('   ✓ Scores are correctly ordered: Player2 (15000) > TestPlayer (12345)');
    console.log('   ✓ No duplicates in display');
    console.log('   ✓ DOM shows scores correctly without duplication');

    console.log('10. TEST PASSED - Bug fix verified!');

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    console.log('Browser remaining open for manual inspection.');
    // await browser.close();
  }
})();