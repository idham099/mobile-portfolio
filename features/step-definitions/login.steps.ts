import { Given, When, Then, After } from '@wdio/cucumber-framework'
import { expect, browser } from '@wdio/globals'

import LoginPage from '../../features/pageobjects/login.page'
import ProductsPage from '../../features/pageobjects/products.page'

After(async () => {
    // Tutup dan buka ulang aplikasi secara instan agar state kembali bersih 100%
    await browser.reloadSession();
});

// === BACKGROUND ===
Given(/^I am on the Swag Labs login page$/, async () => {
    // Memastikan element login sudah siap di layar.
    await expect(LoginPage.usernameInput).toBeDisplayed()
})


//positive login
When(/^I enter the username "([^"]*)"$/, async (username) => {
    await LoginPage.enterUsername(username)
})

When(/^I enter the password "([^"]*)"$/, async (password) => {
    await LoginPage.enterPassword(password)
})

When(/^I click the login button$/, async () => {
    await LoginPage.clickLogin()
})

Then(/^I should be redirected to the Product Dashboard page$/, async () => {
    const isOnDashboard = await ProductsPage.validateOnProductsPage(); // ✅
    expect(isOnDashboard).toBe(true);
    await browser.takeScreenshot();
})


//negative login
Then(/^I should see an error message$/, async () => {
    // Menunggu teks error-nya muncul di emulator (maksimal 5 detik)
    await LoginPage.errorMessage.waitForDisplayed({ timeout: 5000 });
    
    // Memastikan elemennya benar-benar terlihat
    await expect(LoginPage.errorMessage).toBeDisplayed();
    await browser.takeScreenshot();
});
