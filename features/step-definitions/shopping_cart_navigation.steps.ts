import { When, Then } from '@wdio/cucumber-framework';
import allure from '@wdio/allure-reporter';

When('I open the shopping cart page', async () => {
    const btnCart = await $('~test-Cart'); 
    await btnCart.waitForDisplayed({ timeout: 15000 }); 
    await btnCart.click();
    
    // Kodingan kunci agar screenshot muncul di Allure:
    // 1. Ambil screenshot sebagai Base64
    const screenshot = await browser.takeScreenshot(); 
    // 2. Kirim ke Allure sebagai Buffer
    allure.addAttachment('Screenshot Halaman Cart', Buffer.from(screenshot, 'base64'), 'image/png');
    
    await browser.pause(2000); 
});

When('I click the {string} navigation button', async (buttonName: string) => {
    const selector = (buttonName === 'Continue Shopping') ? '~test-CONTINUE SHOPPING' : '~test-CHECKOUT';
    
    const btn = await $(selector);
    await btn.waitForDisplayed({ timeout: 10000 });
    await btn.click();
    
    // Screenshot aksi
    const screenshot = await browser.takeScreenshot();
    allure.addAttachment(`Aksi Klik ${buttonName}`, Buffer.from(screenshot, 'base64'), 'image/png');
});

Then('I should be redirected to the {string} page', async (pageName: string) => {
    // Screenshot verifikasi
    const screenshot = await browser.takeScreenshot();
    allure.addAttachment(`Hasil di Halaman ${pageName}`, Buffer.from(screenshot, 'base64'), 'image/png');
});