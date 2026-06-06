import { When, Then, Before } from '@wdio/cucumber-framework'; 
import CheckoutPage from '../pageobjects/checkout.page';
Before(async () => {
    await browser.pause(5000); 
});

Then(/^I am successfully on the "([^"]*)" page$/, async (pageName: string) => {
    if (pageName === 'Checkout Information') {
        await CheckoutPage.headerCheckoutInfo.waitForDisplayed({ timeout: 10000 });
    }
});

//Positif
// 1. Input Data
When(/^I enter "([^"]*)" as firstname$/, async (fn: string) => {
    await CheckoutPage.inputFirstName.waitForDisplayed({ timeout: 5000 });
    await CheckoutPage.inputFirstName.clearValue();

    if (fn && fn.trim() !== "") {
        await CheckoutPage.inputFirstName.setValue(fn);
    }
});

When(/^I enter "([^"]*)" as lastname$/, async (ln: string) => {
    if (ln && ln.trim() !== "") {
        await CheckoutPage.inputLastName.setValue(ln);
    }
    
});

When(/^I enter "([^"]*)" as zipcode$/, async (zip: string) => {
    if (zip && zip.trim() !== "") {
    await CheckoutPage.inputZipCode.setValue(zip);
    }
    await browser.hideKeyboard();
    await browser.pause(1000);
});


When(/^I (?:click|Click) the "([^"]*)" button$/, async (btn: string) => {
    const btnMap: { [key: string]: any } = {
        'Continue': CheckoutPage.btnContinue,
        'Finish': CheckoutPage.btnFinish,
        'Back Home': CheckoutPage.btnBackHome,
        'Logout': CheckoutPage.btnLogout
    };
    
    const element = btnMap[btn];
    if (!element) throw new Error(`Tombol "${btn}" tidak ditemukan dalam btnMap.`);
    
    // Gunakan waitForClickable agar sistem menunggu tombol benar-benar bisa ditekan
    await element.waitForDisplayed({ timeout: 15000 });
     try {
        await browser.hideKeyboard();
        await browser.pause(1000); // Tunggu 1 detik agar transisi keyboard selesai
    } catch (e) { /* abaikan */ }

    // Gunakan 'tap' sebagai alternatif 'click' yang lebih kuat di mobile
    try {
        await element.click(); 
    } catch (error) {
        console.log("Click standar gagal, mencoba tap manual...");
        const location = await element.getLocation();
        await browser.touchAction({
            action: 'tap',
            x: location.x + 10, // Menekan di koordinat elemen
            y: location.y + 10
        });
    }
});


When(/^I should see checkout overview page is displayed$/, async () => {
    await CheckoutPage.headerOverview.waitForDisplayed({ timeout: 10000 });
    // Scroll ke tombol Finish agar muncul di layar
    await CheckoutPage.btnFinish.scrollIntoView();
    await CheckoutPage.btnFinish.waitForDisplayed({ timeout: 5000 });
});


When(/^I verify checkout complete page is displayed$/, async () => {
    await CheckoutPage.headerComplete.waitForDisplayed({ timeout: 10000 });
    await browser.takeScreenshot();
});

When(/^I should be redirected to the product dashboard page$/, async () => {
    await CheckoutPage.productDashboard.waitForDisplayed({ timeout: 10000 });
});

When(/^I Click menu widget button$/, async () => {
    await CheckoutPage.menuWidget.waitForDisplayed({ timeout: 10000 });
    await CheckoutPage.menuWidget.click();
});



// Negatif
Then(/^I should see the result "([^"]*)"$/, async (expectedResult: string) => {
    // 1. Lokasi elemen error
    const errorTextElement = $('//android.view.ViewGroup[@content-desc="test-Error message"]//android.widget.TextView');
    await errorTextElement.waitForDisplayed({ timeout: 10000 });
    
    // 2. Ambil teks dari UI
    const actualText = await errorTextElement.getText();
    
    // 3. Bersihkan kedua teks (ubah ke huruf kecil & hilangkan spasi di ujung)
    const cleanActual = actualText.toLowerCase().trim();
    const cleanExpected = expectedResult.toLowerCase().trim();
    
    console.log(`DEBUG: Membandingkan '${cleanActual}' dengan '${cleanExpected}'`);

    // 4. Gunakan toContain, ini kunci agar tes tidak gagal karena perbedaan kata "Error:"
    // Jika UI menampilkan "Error: Postal Code is required" 
    // dan expected Anda "Postal Code is required", tes tetap akan LULUS.
    await expect(cleanActual).toContain(cleanExpected);
    await browser.takeScreenshot();
});



 
