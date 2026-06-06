import { When, Then, Given} from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import ProductsPage from '../pageobjects/products.page';
import CartPage from '../pageobjects/cart.page';
import allure from '@wdio/allure-reporter';

// 1. CONSTANT GLOBAL (AMAN: Karena const, tidak bisa diubah oleh fungsi lain)
const productsToBuy = [
    'Sauce Labs Onesie',        // Murah
    'Sauce Labs Bolt T-Shirt',   // Sedang
    'Sauce Labs Fleece Jacket'   // Mahal  
] as const; // 'as const' membuat array ini benar-benar terkunci dan tidak bisa diganggu gugat

// 2. HELPER FUNCTION (TETAP SEPERTI KEINGINAN MAS)
const getProductNameByCondition = (condition: string): string => {
    const clean = condition.replace(/[<>]/g, '').trim().toLowerCase();
    switch (clean) {
        case 'murah':  return 'Sauce Labs Onesie';
        case 'sedang': return 'Sauce Labs Bolt T-Shirt';
        case 'mahal':  return 'Sauce Labs Fleece Jacket';
        default:       return 'Sauce Labs Backpack';
    }
};

let lastAddedProduct: string = '';

// =============================================================================
// SCENARIO 1: @direct-cart - VERSI BEBAS KANCING (REFRESH SIKLUS VIEWPORT)
// =============================================================================

When('I click "Add to Cart" directly for a {string} priced product', async (condition: string) => {
    lastAddedProduct = getProductNameByCondition(condition);
    
    // 1. JANGKAR AMAN: Tunggu minimal teks dashboard produk muncul di layar emulator
    const anchorProduct = await $(`android=new UiSelector().text("Sauce Labs Backpack")`);
    await anchorProduct.waitForDisplayed({ timeout: 20000 });
    await driver.pause(2000); // Jeda napas agar rendering aplikasi selesai sempurna

    // 2. BREAK THE STUCK (SOLUSI MUTLAK UNTUK ITERASI 2 & 3):
    // Jika targetnya produk Sedang atau Mahal, kita paksa emulator melakukan SWIPE KE BAWAH secara manual
    // Langkah ini untuk memicu Android memperbarui daftar pohon elemennya yang sering beku pasca-restart.
    if (condition.toLowerCase() !== 'murah') {
        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: 500, y: 1500 }, // Titik sentuh awal (bawah)
                { type: 'pointerDown', button: 0 },
                { type: 'pointerMove', duration: 1000, x: 500, y: 600 }, // Tarik ke atas (efek gulung ke bawah)
                { type: 'pointerUp', button: 0 }
            ]
        }]);
        await driver.pause(1500); // Jeda stabilisasi setelah layar diusap
    }

    // 3. AUTO-SCROLL GOOGLE API: Menembak sisa jarak koordinat secara presisi
    await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${lastAddedProduct}"))`);
    await driver.pause(1500); 

    // 4. KUNCI SASARAN TOMBOL: Tembak dengan XPath dinamis andalan Mas
    const targetAddToCartButton = await $(
        `//*[@text="${lastAddedProduct}"]/ancestor::android.view.ViewGroup[@content-desc="test-Item"]//*[@content-desc="test-ADD TO CART"]`
    );
    
    // 5. KLIK TOMBOL
    await targetAddToCartButton.waitForDisplayed({ timeout: 10000 });
    await targetAddToCartButton.click();
    
    await driver.pause(2000); // Jeda aman memastikan item masuk keranjang
});

When('I open the shopping cart page for single item', async () => {
    // Tarik layar kembali ke atas satu kali secara halus sebelum mengeklik ikon keranjang
    try {
        await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollBackward(1)`);
        await driver.pause(1000);
    } catch (e) {}
    
    await ProductsPage.openCart();
    await driver.pause(2500); 
});

Then('I should see the correct product listed inside the Cart for single item', async () => {
    // AMBIL SCREENSHOT UNTUK BUKTI NYATA DI LAPORAN ALLURE
    const { addAttachment } = require('@wdio/allure-reporter');
    const screenshot = await browser.takeScreenshot();
    addAttachment(`Bukti Halaman Cart - ${lastAddedProduct}`, Buffer.from(screenshot, 'base64'), 'image/png');

    // VALIDASI ASERSINYA
    const isVisible = await CartPage.isProductVisibleInCart(lastAddedProduct);
    expect(isVisible).toBe(true);
});




// =============================================================================
// SCENARIO 2: @detail-cart (DENGAN TAMBAHAN SCROLL DI DALAM DETAIL PAGE)
// =============================================================================

/**
 * Step 1: Cari produk di dashboard, scroll, lalu klik nama produknya untuk masuk ke Detail
 */
When('I click on a {string} priced product to open its detail page', async (condition: string) => {
    lastAddedProduct = getProductNameByCondition(condition);
    
    const anchorProduct = await $(`android=new UiSelector().text("Sauce Labs Backpack")`);
    await anchorProduct.waitForDisplayed({ timeout: 20000 });
    await driver.pause(2000); 

    if (condition.toLowerCase() !== 'murah') {
        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: 500, y: 1500 },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerMove', duration: 1000, x: 500, y: 600 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
        await driver.pause(1500);
    }

    await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${lastAddedProduct}"))`);
    await driver.pause(1500);

    const productTextElement = await $(`android=new UiSelector().text("${lastAddedProduct}")`);
    await productTextElement.waitForDisplayed({ timeout: 10000 });
    await productTextElement.click();
    
    await driver.pause(2500); // Tunggu sampai halaman detail terbuka sempurna
});

/**
 * Step 2: TAMBAHAN SCROLL DI SINI - Menuju tombol Add to Cart di dalam detail page baru klik
 */
When('I click {string} inside the product detail page', async (buttonText: string) => {
    // 1. SCROLL DI DETAIL PAGE: Pastikan Android melakukan scroll ke bawah di dalam detail page 
    // sampai tombol dengan content-desc "test-ADD TO CART" benar-benar terlihat.
    try {
        await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("test-ADD TO CART"))`);
        await driver.pause(1000);
    } catch (e) {
        // Abaikan jika tombolnya ternyata sudah langsung terlihat tanpa perlu scroll
    }

    // 2. Kunci elemen tombol Add to Cart
    const elAddToCartDetail = await $(`android=new UiSelector().description("test-ADD TO CART")`);
    
    // 3. Pastikan muncul secara visual, lalu klik!
    await elAddToCartDetail.waitForDisplayed({ timeout: 10000 });
    await elAddToCartDetail.click();
    
    await driver.pause(2000); // Jeda aman memastikan item masuk keranjang
});


// =============================================================================
// SHARED STEPS (NAVIGASI KE CART & VALIDASI ASERSINYA)
// =============================================================================

When('I open the shopping cart page for detail page', async () => {
    try {
        await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollBackward(1)`);
        await driver.pause(1000);
    } catch (e) {}
    
    await ProductsPage.openCart();
    await driver.pause(2500); 
});

Then('I should see the correct product listed inside the Cart for detail page', async () => {
    const { addAttachment } = require('@wdio/allure-reporter');
    const screenshot = await browser.takeScreenshot();
    addAttachment(`Bukti Detail Cart - ${lastAddedProduct}`, Buffer.from(screenshot, 'base64'), 'image/png');

    const isVisible = await CartPage.isProductVisibleInCart(lastAddedProduct);
    expect(isVisible).toBe(true);
});



// =============================================================================
// SCENARIO 3: @multiple-items (VERSI OPTIMASI SATU SESI ALIRAN BEBAS)
// =============================================================================


/**
 * Step 1: Borong produk satu per satu secara berurutan ke bawah
 */
When('I click "Add to Cart" directly for multiple products', async () => {
    // 1. JANGKAR AWAL: Pastikan halaman utama dashboard sudah siap merender konten
    const anchorProduct = await $(`android=new UiSelector().text("Sauce Labs Backpack")`);
    await anchorProduct.waitForDisplayed({ timeout: 20000 });
    await driver.pause(2000);

    for (const productName of productsToBuy) {
        console.log(`--- Memproses Produk: ${productName} ---`);

        // 2. AUTO-SCROLL HALUS: Cari teks nama produk dari posisi terakhir layar saat itu
        // Kita gunakan scrollIntoView bawaan Android UIAutomator murni tanpa interupsi swipe manual
        const targetTextElement = await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${productName}"))`);
        await targetTextElement.waitForDisplayed({ timeout: 10000 });
        await driver.pause(1500); // Jeda stabilisasi agar koordinat tombol terbaca sempurna

        // 3. TARGETING SELEKTOR XPATH: Mengunci tombol ADD TO CART milik produk tersebut
        const targetButton = await $(
            `//*[@text="${productName}"]/ancestor::android.view.ViewGroup[@content-desc="test-Item"]//*[@content-desc="test-ADD TO CART"]`
        );

        // 4. EKSEKUSI KLIK
        await targetButton.waitForDisplayed({ timeout: 10000 });
        await targetButton.click();
        
        console.log(`--- Sukses Klik ADD TO CART: ${productName} ---`);
        await driver.pause(1500); // Jeda aman sebelum lanjut mencari barang berikutnya
    }
});

/**
 * Step 2 & 3: Navigasi dan Validasi Borongan (Sudah disesuaikan agar dibaca When/And di VS Code)
 */
When('I open the shopping cart page for multiple items', async () => {
    // Tarik layar kembali ke paling atas karena posisi terakhir pasti berada di bawah setelah borong barang
    try {
        await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(3)`);
        await driver.pause(1500);
    } catch (e) {
        // Abaikan jika gagal scroll up, tetap paksa klik openCart
    }
    
    await ProductsPage.openCart();
    await driver.pause(2500); 
});

Then('I should see the correct product listed inside the Cart for multiple items', async () => {
    // 1. Jalankan perulangan untuk memeriksa tiap produk yang tadi dibeli
    for (const productName of productsToBuy) {
        console.log(`--- Memeriksa Keberadaan Produk di Cart: ${productName} ---`);

        // 2. PENGAMAN SCROLL DI CART:
        // Gulung layar keranjang belanja secara otomatis ke bawah sampai nama produk target terlihat.
        // Ini memastikan produk di baris bawah (seperti Fleece Jacket) tidak terlewat oleh asersi.
        try {
            await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${productName}"))`);
            await driver.pause(1000); // Jeda stabilisasi layar setelah bergeser
        } catch (e) {
            console.log(`[Peringatan] Gagal melakukan scroll untuk produk: ${productName}`);
        }

        // 3. AMBIL ASERSINYA DARI CART PAGE OBJECT MAS
        const isVisible = await CartPage.isProductVisibleInCart(productName);
        expect(isVisible).toBe(true);
        
        console.log(`--- Produk Verified Sukses di Cart: ${productName} ---`);
    }

    // 4. AMBIL BUKTI VISUAL AKHIR UNTUK ALLURE REPORT
    // Kita tarik kembali layar ke atas sedikit agar tumpukan atas keranjang terlihat saat difoto
    try {
        await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(1)`);
        await driver.pause(1000);
    } catch (e) {}

    const { addAttachment } = require('@wdio/allure-reporter');
    const screenshot = await browser.takeScreenshot();
    addAttachment('Bukti Validasi Semua Isi Keranjang', Buffer.from(screenshot, 'base64'), 'image/png');
});





// =============================================================================
// SCENARIO 4: @detail-cart + @multiple-items (BORONG LEWAT DETAIL PAGE)
// =============================================================================

When('I add multiple products to the cart by opening each product detail page', async () => {
    const anchorProduct = await $(`android=new UiSelector().text("Sauce Labs Backpack")`);
    await anchorProduct.waitForDisplayed({ timeout: 20000 });
    await driver.pause(2000);

    for (const productName of productsToBuy) {
        const targetTextElement = await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${productName}"))`);
        await targetTextElement.waitForDisplayed({ timeout: 10000 });
        await driver.pause(1000);

        // Klik nama produk untuk masuk halaman detail
        await targetTextElement.click();
        await driver.pause(2000); 

        // Scroll di dalam halaman detail mencari tombol Add to Cart
        try {
            await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("test-ADD TO CART"))`);
            await driver.pause(1000);
        } catch (e) {}

        const elAddToCartDetail = await $(`android=new UiSelector().description("test-ADD TO CART")`);
        await elAddToCartDetail.waitForDisplayed({ timeout: 10000 });
        await elAddToCartDetail.click();
        await driver.pause(1500); 

        // Klik tombol back untuk kembali berburu ke dashboard (kecuali produk terakhir)
        if (productName !== productsToBuy[productsToBuy.length - 1]) {
            const btnBackToProducts = await $(`android=new UiSelector().description("test-BACK TO PRODUCTS")`);
            await btnBackToProducts.waitForDisplayed({ timeout: 10000 });
            await btnBackToProducts.click();
            await driver.pause(2000); 
        }
    }
});


// =============================================================================
// SHARED STEPS NAVIGATION & VALIDASI (RE-INDEX SECARA UNIVERSAL)
// =============================================================================

// Regex universal agar dibaca sempurna sebagai "When" maupun "And" oleh VS Code Autocomplete
When('I open the shopping cart page for multiple detail items', async () => {
    try {
        await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(3)`);
        await driver.pause(1500);
    } catch (e) {}
    
    await ProductsPage.openCart();
    await driver.pause(2500); 
});

// Then('I should see the correct product listed inside the Cart for multiple detail items', async () => {
//     const isVisible = await CartPage.isProductVisibleInCart(lastAddedProduct);
//     expect(isVisible).toBe(true);

//     const { addAttachment } = require('@wdio/allure-reporter');
//     const screenshot = await browser.takeScreenshot();
//     addAttachment(`Bukti Single Cart - ${lastAddedProduct}`, Buffer.from(screenshot, 'base64'), 'image/png');
// });

Then('I should see all the selected products listed inside the Cart for multiple detail items', async () => {
    for (const productName of productsToBuy) {
        try {
            await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${productName}"))`);
            await driver.pause(1000);
        } catch (e) {}

        const isVisible = await CartPage.isProductVisibleInCart(productName);
        expect(isVisible).toBe(true);
    }

    try {
        await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(1)`);
        await driver.pause(1000);
    } catch (e) {}

    const { addAttachment } = require('@wdio/allure-reporter');
    const screenshot = await browser.takeScreenshot();
    addAttachment('Bukti Keranjang Borongan Lewat Detail Page', Buffer.from(screenshot, 'base64'), 'image/png');
});





// =============================================================================
// SCENARIO 5: @negative @cart @empty-state (LENGKAP DENGAN PEMILIHAN PRODUK)
// =============================================================================
When('I click "Add to Cart" directly for products {string}', async (conditions: string) => {
    // Memecah string "murah, sedang" menjadi ["murah", "sedang"]
    const productList = conditions.split(',').map(item => item.trim());

    for (const condition of productList) {
        const productName = getProductNameByCondition(condition);
        console.log(`Menambahkan produk: ${productName}`);

        // Scroll ke produk
        await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("${productName}")`);
        await driver.pause(1000);

        // Cari tombol ADD TO CART milik produk yang sedang diproses
        // Kita gunakan Xpath yang mencari tombol berdasarkan parent yang mengandung teks produk
        const addButton = await $(`//android.widget.TextView[@text="${productName}"]/ancestor::android.view.ViewGroup[contains(@content-desc, "test-Item")]//*[@content-desc="test-ADD TO CART"]`);
        
        await addButton.waitForDisplayed({ timeout: 5000 });
        await addButton.click();
        
        // Jeda sebentar agar sistem tidak bingung saat proses klik berturut-turut
        await driver.pause(1000);
    }
});

When('I open the shopping cart page for empty state', async () => {
    console.log("Membuka keranjang dengan metode aman...");

    // Hanya sembunyikan keyboard, JANGAN gunakan driver.back() atau scrollToBeginning
    try { await driver.hideKeyboard(); } catch (e) {}

    // Klik ikon keranjang secara langsung (sticky header)
    const cartIcon = await $('~test-Cart');
    await cartIcon.waitForDisplayed({ timeout: 15000 }); // Beri waktu tunggu lebih lama
    await cartIcon.click();
    
    // Tunggu sampai header keranjang muncul
    const cartHeader = await $('android=new UiSelector().textContains("YOUR CART")');
    await cartHeader.waitForDisplayed({ timeout: 10000 });
    
    console.log("Berhasil masuk ke halaman keranjang.");
});

Then('I click the "Remove" button for that product', async () => {
    console.log("Memulai prosedur klik Native Android...");

    while (true) {
        // Cari elemennya
        const btnRemove = await $('~test-REMOVE');

        // Cek apakah tombol masih ada di layar
        if (await btnRemove.isExisting()) {
            await btnRemove.waitForDisplayed({ timeout: 10000 });
            
            // Eksekusi klik langsung melalui sistem Android (UiAutomator2)
            await driver.execute('mobile: clickGesture', {
                elementId: await btnRemove.elementId,
            });

            console.log("Klik Native berhasil dikirim.");
            
            // Tunggu animasi hapus selesai
            await driver.pause(3000); 

            const screenshot = await driver.takeScreenshot();
            allure.addAttachment('Screenshot Setelah Remove', Buffer.from(screenshot, 'base64'), 'image/png');

        } else {
            console.log("Semua item berhasil dihapus.");
            break;
        }
    }
});