import { RegisterPage } from './register.po';
import { browser, ExpectedConditions } from 'protractor';

describe('Register flow', () => {
  let page: RegisterPage;

  beforeEach(async () => {
    page = new RegisterPage();
    page.navigateTo();
    browser.executeScript('window.localStorage.clear();');
  });

  it('should display title on form', async () => {
    expect(page.getFormTitle()).toEqual('Register');
  });

  it('should fill in register form', async () => {
    page.getUsernameInput().sendKeys('Tester');
    page.getEmailInput().sendKeys('test@mailinator.com');
    page.getPasswordInput().sendKeys('testtest01');
    page.getRegisterButton().click();

    browser.wait(ExpectedConditions.urlContains('onboarding'), 10000).then(async function () {
      expect(browser.getCurrentUrl()).toBe(browser.baseUrl + 'onboarding');
      page.deleteAccount();
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
