import { $ } from '@wdio/globals';

class ProductsPage {
    /**
     * SELECTORS (Elemen-elemen pada Dashboard Produk Swag Labs Mobile)
     */
    // Container utama dashboard produk
    get productContainer() {
        return $('~test-PRODUCTS');
    }

    // Tombol/Ikon keranjang belanja yang ada di pojok kanan atas dashboard
    get btnCart() {
        return $('~test-Cart');
    }

    // Header tulisan "PRODUCTS" di area dashboard
    get productDashboardHeader() {
        return $('//android.widget.TextView[@text="PRODUCTS"] | //XCUIElementTypeStaticText[@name="PRODUCTS"]');
    }

    /**
     * FUNCTIONS / ACTIONS
     */

    /**
     * Validasi apakah user berhasil dialihkan ke halaman Product Dashboard
     */
    async validateOnProductsPage(): Promise<boolean> {
        try {
            await this.productContainer.waitForDisplayed({ timeout: 10000 });
            return await this.productContainer.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Membuka halaman keranjang belanja (Cart Page) dengan menekan ikon Cart
     */
    async openCart(): Promise<void> {
        await this.btnCart.waitForDisplayed({ timeout: 5000 });
        await this.btnCart.click();
    }

    /**
     * Menambahkan item ke keranjang belanja langsung dari Dashboard berdasarkan Nama Produk
     * @param productName Nama produk asli Swag Labs (cth: 'Sauce Labs Bolt T-Shirt')
     */
    async clickAddToCartByName(productName: string): Promise<void> {
        // Step 1: Scroll sampai teks nama produk kelihatan di layar
        // UiScrollable lebih reliable daripada swipe manual untuk list produk
        await $(`android=new UiScrollable(new UiSelector().scrollable(true))` +
                `.scrollIntoView(new UiSelector().text("${productName}"))`);
 
        // Step 2: Naik ke parent container produk (test-Item), lalu cari tombol ADD TO CART di dalamnya
        // Pakai ancestor:: karena lebih robust dibanding ../.. yang tergantung jumlah level DOM
        const btnAddToCart = await $(
            `//*[@text="${productName}"]` +
            `/ancestor::android.view.ViewGroup[@content-desc="test-Item"]` +
            `//*[@content-desc="test-ADD TO CART"]`
        );
 
        await btnAddToCart.waitForDisplayed({ timeout: 5000 });
        await btnAddToCart.click();
    }
}
 
export default new ProductsPage();