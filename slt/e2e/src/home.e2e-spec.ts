import { HomePage } from './home.po';
import { browser } from 'protractor';

describe('Home page', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
    page.navigateToHomePage();
  });

  it('should display title', () => {
    expect(page.getTitleText()).toEqual('Macrolog');
  });

  it('should navigate to about page', () => {
    page.getAboutMenuItem().click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + 'about');
  });

  it('should navigate to login page', () => {
    page.getLoginButton().click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + 'login');
  });

  it('should navigate to register page', () => {
    page.getRegisterButton().click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + 'login');
  });

  it('should navigate to google play store', async () => {
    await browser.waitForAngularEnabled(false);
    page.getDownloadButton().click().then(function () {
      browser.getAllWindowHandles().then(function (handles) {
        const newWindowHandle = handles[1];
        browser.switchTo().window(newWindowHandle).then(function () {
          expect(browser.getCurrentUrl()).toBe('https://play.google.com/store/apps/details?id=com.csl.macrologandroid');
        });
      });
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
