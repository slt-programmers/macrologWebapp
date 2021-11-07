import { AppPage } from './app.po';
import { browser, logging, ExpectedConditions } from 'protractor';

describe('Start Macrolog', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should wait for server', async () => {
    page.navigateTo();
    const title = page.getTitle();
    browser.wait(ExpectedConditions.presenceOf(title), 60000, 'Could not find title on homepage').then(async function () {
      const titleText = await title.getText();
      expect(titleText).toBe('Macrolog');
    });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    // const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    // expect(logs).not.toContain(jasmine.objectContaining({
    //   level: logging.Level.SEVERE,
    // } as logging.Entry));
  });
});
