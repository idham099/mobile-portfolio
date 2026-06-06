import { When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import allure from '@wdio/allure-reporter';

When('I click the "Remove" button in the cart', async () => {
    // 1. Definisikan selector (pastikan case-sensitive sesuai inspector)
    const btnRemove = await $('~test-REMOVE');
    
    // 2. Coba scroll ke elemen jika berada di bagian bawah list
    await btnRemove.scrollIntoView(); 
    
    // 3. Tunggu sampai benar-benar muncul
    await btnRemove.waitForDisplayed({ timeout: 15000 });
    
    // 4. Klik
    await btnRemove.click();
    
    const screenshot = await browser.takeScreenshot();
    await allure.addAttachment('Screenshot Aksi Remove', Buffer.from(screenshot, 'base64'), 'image/png');

    console.log("Tombol Remove berhasil diklik.");
});

// Verifikasi produk hilang
Then('the product should be removed from the list', async () => {
    const btnRemove = await $('~test-REMOVE');
    // Kita pastikan elemen tersebut sudah tidak ada lagi di layar
    await expect(btnRemove).not.toExist();
    console.log("Produk berhasil dihapus dari list.");
});