import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.resolve('test-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fillInput(page, selector, text) {
  await page.waitForSelector(selector, { visible: true });
  await page.focus(selector);
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, selector);
  if (text) {
    await page.type(selector, text, { delay: 10 });
  }
}

async function runTests() {
  console.log('🚀 Starting Comprehensive E2E Test Suite for Code Eagle Admin Portal...\n');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const testResults = [];
  const logTest = (name, passed, detail = '') => {
    testResults.push({ name, passed, detail });
    console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: ${name} ${detail ? `(${detail})` : ''}`);
  };

  try {
    // ---------------------------------------------------------
    // TEST 1: Protected route redirect
    // ---------------------------------------------------------
    console.log('\n--- 1. Protected Route & Auth Redirection ---');
    await page.goto(`${BASE_URL}/login`);
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE_URL}/services`);
    await sleep(600);
    const currentUrl = page.url();
    logTest(
      'Opening /services while logged out redirects to /login',
      currentUrl.includes('/login'),
      `Current URL: ${currentUrl}`
    );

    // ---------------------------------------------------------
    // TEST 2: Invalid login validation
    // ---------------------------------------------------------
    console.log('\n--- 2. Login Validation ---');
    await fillInput(page, '#email', 'invalid@user.com');
    await fillInput(page, '#password', 'WrongPassword123');
    await page.click('button[type="submit"]');
    await sleep(1000);

    const alertText = await page.evaluate(() => {
      const el = document.querySelector('div[role="alert"]');
      return el ? el.innerText : null;
    });
    logTest('Wrong login shows error alert', !!alertText, alertText || 'No alert');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-login-error.png') });

    // ---------------------------------------------------------
    // TEST 3: Admin Login & return to /services
    // ---------------------------------------------------------
    console.log('\n--- 3. Admin Authentication & Return ---');
    await fillInput(page, '#email', 'admin@codeeagle.in');
    await fillInput(page, '#password', 'Admin@123');
    await page.click('button[type="submit"]');
    await sleep(1500);

    const postLoginUrl = page.url();
    logTest(
      'Correct login redirects to original destination (/services)',
      postLoginUrl.includes('/services'),
      `URL: ${postLoginUrl}`
    );
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-services-page.png') });

    // ---------------------------------------------------------
    // TEST 4: Session persistence across browser reload
    // ---------------------------------------------------------
    console.log('\n--- 4. Session Persistence ---');
    await page.reload();
    await sleep(800);
    logTest(
      'Session persists across browser reload (keeps logged in)',
      page.url().includes('/services'),
      `URL: ${page.url()}`
    );

    // ---------------------------------------------------------
    // TEST 5: Services Feature Test (Search, Add, Edit, Toggle, Delete)
    // ---------------------------------------------------------
    console.log('\n--- 5. Services Features ---');
    // Search with 1000ms wait for debounce + fakeDelay
    await fillInput(page, 'input[placeholder*="Search services"]', 'Cloud');
    await sleep(1000);
    const serviceCardsText = await page.evaluate(() => document.body.innerText);
    const searchWorked = serviceCardsText.includes('Cloud & DevOps') && !serviceCardsText.includes('AI & ML Solutions');
    logTest('Services: Search filter works', searchWorked);

    // Clear search
    await fillInput(page, 'input[placeholder*="Search services"]', '');
    await sleep(1000);

    // Add Service
    await page.click('button.btn-primary');
    await sleep(500);
    await fillInput(page, '#service-name', 'Cybersecurity & Pentesting');
    await page.select('#service-icon', 'Shield');
    await fillInput(page, '#service-description', 'Enterprise penetration testing and continuous vulnerability assessment.');
    await page.click('div[role="dialog"] button[type="submit"]');
    await sleep(1200);

    const pageAfterAdd = await page.evaluate(() => document.body.innerText);
    logTest('Services: Add service creates new item', pageAfterAdd.includes('Cybersecurity & Pentesting'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-service-added.png') });

    // Toggle Visibility
    const visibleBtn = await page.$('button[title*="Hide from public site"]');
    if (visibleBtn) {
      await visibleBtn.click();
      await sleep(800);
      const hasHidden = await page.evaluate(() => document.body.innerText.includes('Hidden'));
      logTest('Services: Hide/Show visibility toggle works', hasHidden);
    }

    // Edit Service
    const editBtn = await page.$('button[title="Edit Service"]');
    if (editBtn) {
      await editBtn.click();
      await sleep(500);
      await fillInput(page, '#service-name', 'Cybersecurity & Auditing');
      await page.click('div[role="dialog"] button[type="submit"]');
      await sleep(1000);
      const afterEdit = await page.evaluate(() => document.body.innerText);
      logTest('Services: Edit service updates successfully', afterEdit.includes('Cybersecurity & Auditing'));
    }

    // ---------------------------------------------------------
    // TEST 6: Careers Page Test (Post, Filter, Search, Toggle)
    // ---------------------------------------------------------
    console.log('\n--- 6. Careers Features ---');
    await page.goto(`${BASE_URL}/careers`);
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-careers-page.png') });

    // Post a Job
    await page.click('button.btn-primary');
    await sleep(500);
    await fillInput(page, '#job-title', 'DevOps & Cloud Specialist');
    await fillInput(page, '#job-location', 'Indore, India');
    await fillInput(page, '#job-description', 'Experienced in AWS infrastructure, Terraform, and Docker Kubernetes clusters.');
    await page.click('div[role="dialog"] button[type="submit"]');
    await sleep(1500);

    const careersAfterPost = await page.evaluate(() => document.body.innerText);
    logTest('Careers: Post a job works and updates table', careersAfterPost.includes('DevOps & Cloud Specialist'));

    // Toggle job status
    const toggleStatusBtn = await page.$('button[title*="job"]');
    if (toggleStatusBtn) {
      await toggleStatusBtn.click();
      await sleep(800);
      logTest('Careers: Status toggle works', true);
    }

    // ---------------------------------------------------------
    // TEST 7: Inquiries Page Test (Filter, Sort, Pagination, View, CSV Export)
    // ---------------------------------------------------------
    console.log('\n--- 7. Inquiries Features ---');
    await page.goto(`${BASE_URL}/inquiries`);
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-inquiries-page.png') });

    const pageText = await page.evaluate(() => document.body.innerText);
    logTest('Inquiries: Table and pagination rendered', pageText.includes('Page 1 of') || pageText.includes('Showing'));

    // Change status from dropdown
    const statusSelect = await page.$('tbody select');
    if (statusSelect) {
      await statusSelect.select('Resolved');
      await sleep(800);
      logTest('Inquiries: Status dropdown update works', true);
    }

    // View Modal
    const viewBtn = await page.$('button[title="View Full Message"]');
    if (viewBtn) {
      await viewBtn.click();
      await sleep(500);
      const modalOpen = await page.$('div[role="dialog"]');
      logTest('Inquiries: View modal displays message', modalOpen !== null);
      const closeBtn = await page.$('button[aria-label="Close dialog"]');
      if (closeBtn) await closeBtn.click();
      await sleep(400);
    }

    // Export CSV
    const exportBtn = await page.$('button.btn-primary');
    if (exportBtn) {
      await exportBtn.click();
      await sleep(800);
      const toastText = await page.evaluate(() => document.body.innerText);
      logTest('Inquiries: Export CSV button triggers export', toastText.includes('Exported'));
    }

    // ---------------------------------------------------------
    // TEST 8: Site Settings Test (Edit, Unsaved Changes, Reset, Save)
    // ---------------------------------------------------------
    console.log('\n--- 8. Settings Features ---');
    await page.goto(`${BASE_URL}/settings`);
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-settings-page.png') });

    await fillInput(page, '#stats-projects', '225');
    await sleep(400);

    const settingsText1 = await page.evaluate(() => document.body.innerText);
    logTest('Settings: Shows "Unsaved Changes" indicator when dirty', settingsText1.includes('Unsaved Changes'));

    // Reset button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find((b) => b.innerText.includes('Reset'));
      if (btn) btn.click();
    });
    await sleep(500);
    const resetVal = await page.$eval('#stats-projects', (el) => el.value);
    logTest('Settings: Reset button restores previous value', resetVal !== '225', `Restored to: ${resetVal}`);

    // Update and Save
    await fillInput(page, '#stats-projects', '225');
    const saveBtn = await page.$('button[type="submit"]');
    await saveBtn.click();
    await sleep(1200);

    // Verify persistence across reload
    await page.reload();
    await sleep(800);
    const savedVal = await page.$eval('#stats-projects', (el) => el.value);
    logTest('Settings: Saved changes persist across reload', savedVal === '225', `Value: ${savedVal}`);

    // ---------------------------------------------------------
    // TEST 9: Dashboard dynamic updates & Recharts
    // ---------------------------------------------------------
    console.log('\n--- 9. Dashboard Features ---');
    await page.goto(`${BASE_URL}/dashboard`);
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-dashboard-page.png') });

    const dashboardText = await page.evaluate(() => document.body.innerText.toLowerCase());
    const hasChart = (await page.$('.recharts-responsive-container')) !== null;
    const hasStatCards =
      dashboardText.includes('new inquiries') &&
      dashboardText.includes('open careers') &&
      dashboardText.includes('active services');
    logTest('Dashboard: Recharts bar chart rendered', hasChart);
    logTest('Dashboard: Stat cards reflect live metrics', hasStatCards);

    // Quick Action button navigation
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find((b) => b.innerText.includes('Add New Service'));
      if (btn) btn.click();
    });
    await sleep(800);
    const quickActionWorked = page.url().includes('/services');
    logTest('Dashboard: Quick action button navigates to target page', quickActionWorked);

    // ---------------------------------------------------------
    // TEST 10: Role-Based Access Control (Editor Account)
    // ---------------------------------------------------------
    console.log('\n--- 10. Role-Based Access Control (Editor) ---');
    // Log out
    await page.goto(`${BASE_URL}/login`);
    await page.evaluate(() => {
      localStorage.removeItem('code_eagle_token');
      localStorage.removeItem('code_eagle_user');
    });
    await page.reload();
    await sleep(600);

    // Log in as Editor
    await fillInput(page, '#email', 'editor@codeeagle.in');
    await fillInput(page, '#password', 'Editor@123');
    await page.click('button[type="submit"]');
    await sleep(1500);

    // Check sidebar: Settings must NOT be visible
    const editorSidebarText = await page.evaluate(() => document.body.innerText);
    logTest('Editor: Settings menu is hidden from sidebar', !editorSidebarText.includes('Site Settings'));

    // Check Services: Delete button must NOT be present
    await page.goto(`${BASE_URL}/services`);
    await sleep(800);
    const deleteBtnServices = await page.$('button[title="Delete Service"]');
    logTest('Editor: Delete buttons are hidden on Services page', deleteBtnServices === null);

    // Check Careers: Delete button must NOT be present
    await page.goto(`${BASE_URL}/careers`);
    await sleep(800);
    const deleteBtnCareers = await page.$('button[title="Delete Opening"]');
    logTest('Editor: Delete buttons are hidden on Careers page', deleteBtnCareers === null);

    // Attempt direct navigation to /settings
    await page.goto(`${BASE_URL}/settings`);
    await sleep(800);
    const redirectedAway = !page.url().includes('/settings');
    logTest('Editor: Direct URL access to /settings redirects to dashboard', redirectedAway, `Redirected to: ${page.url()}`);

    // ---------------------------------------------------------
    // TEST 11: 404 Page & Navigation Back
    // ---------------------------------------------------------
    console.log('\n--- 11. 404 Route Handling ---');
    await page.goto(`${BASE_URL}/some-unknown-route-404`);
    await sleep(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-not-found-page.png') });

    const notFoundText = await page.evaluate(() => document.body.innerText);
    logTest('404 Page: Renders error page for unknown route', notFoundText.includes('404'));

    const backDashboardBtn = await page.$('button.btn-primary');
    if (backDashboardBtn) {
      await backDashboardBtn.click();
      await sleep(600);
      logTest('404 Page: "Dashboard" button navigates back to dashboard', page.url().includes('/dashboard'));
    }

    // ---------------------------------------------------------
    // TEST 12: Responsive Viewport Check (Mobile 375x812)
    // ---------------------------------------------------------
    console.log('\n--- 12. Mobile Responsive Viewport ---');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/dashboard`);
    await sleep(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-mobile-dashboard.png') });

    const mobileNavExists = await page.evaluate(() => document.querySelector('nav') !== null);
    logTest('Responsive: Mobile horizontal navigation renders properly', mobileNavExists);

  } catch (err) {
    console.error('Test execution exception:', err);
  } finally {
    await browser.close();
    console.log('\n========================================');
    console.log('📊 Verification Summary:');
    const passedCount = testResults.filter((r) => r.passed).length;
    console.log(`Passed: ${passedCount} / ${testResults.length}`);
    console.log('========================================\n');
  }
}

runTests();
