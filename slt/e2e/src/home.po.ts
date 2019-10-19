import { browser, by, element, ElementArrayFinder } from 'protractor';

export class HomePage {
  navigateToHomePage() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('home div.split__left h1.title')).getText() as Promise<string>;
  }

  // shortcut $$() notation instead of element.all(by.css())
  getAboutMenuItem() {
    return element.all(by.css('div.navbar-item')).filter(async function (elem, index) {
      const text = await elem.getText();
      return text === 'About';
    }).first();
  }

  getDownloadButton() {
    return element(by.css('a.button.button--primary.button--large'));
  }

  getLoginButton() {
    return element.all(by.css('div.navbar-item button')).filter(async function (elem, index) {
      const text = await elem.getText();
      return text === 'Log In';
    }).first();
  }

  getRegisterButton() {
    return element.all(by.css('div.navbar-item button')).filter(async function (elem, index) {
      const text = await elem.getText();
      return text === 'Register';
    }).first();
  }
}
