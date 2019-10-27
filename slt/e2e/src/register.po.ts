import { browser, by, element } from 'protractor';

export class RegisterPage {
  navigateTo() {
    return browser.get(browser.baseUrl + 'login') as Promise<any>;
  }

  getFormTitle() {
    return element.all(by.css('h3.content__form__title'))
      .filter(async function (elem, index) {
        const text = await elem.getText();
        return text === 'Register';
      }).first().getText();
  }

  getUsernameInput() {
    return this.getInput('newUsername');
  }

  getEmailInput() {
    return this.getInput('newEmail');
  }

  getPasswordInput() {
    return this.getInput('newPassword');
  }

  getRegisterButton() {
    return element(by.id('registerBtn'));
  }

  deleteAccount() {
    const profileMenuItem = element.all(by.css('div.menu__item'))
      .filter(async function (elem, index) {
        const routerlink = await elem.getAttribute('routerlink');
        return routerlink === '/user';
      });
    profileMenuItem.click().then(function () {
      const accountSubnavItem = element.all(by.css('div.subnav__item'))
        .filter(async function (elem, index) {
          const subnavItem = await elem.getText();
          return subnavItem === 'Account';
        });
      accountSubnavItem.click().then(function () {
        const deleteButton = element(by.css('button.button.button--warning'));
        deleteButton.click().then(function () {
          const passwordInput = element(by.css('div.modal__content input'));
          passwordInput.sendKeys('testtest01');
          const yesButton = element(by.css('div.modal__button-wrapper button.button.button--warning'));
          yesButton.click();
        });
      });
    });
  }

  private getInput(attribute: string) {
    return element.all(by.css('input.mat-input-element'))
      .filter(async function (elem, index) {
        const name = await elem.getAttribute('name');
        return name === attribute;
      });
  }


  // shortcut $$() notation instead of element.all(by.css())

}
