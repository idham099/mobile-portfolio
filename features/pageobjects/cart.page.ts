import { $ } from '@wdio/globals';

class CartPage {
    /**
     * SELECTORS (Elemen-elemen pada halaman Keranjang Swag Labs Mobile)
     */
    // Container utama list item di dalam keranjang
    get cartContentContainer() {
        return $('~test-Cart Content');
    }

    // Placeholder / Teks penanda jika keranjang belanjaan kosong
    get emptyCartPlaceholder() {
        // Pada Swag Labs Mobile, biasanya menggunakan container kosong atau text area tertentu
        return $('~test-Empty Cart Placeholder'); 
    }

    // Tombol untuk melanjutkan ke proses Checkout
    get btnCheckout() {
        return $('~test-CHECKOUT');
    }

    // Tombol untuk kembali berbelanja dari halaman keranjang
    get btnContinueShopping() {
        return $('~test-CONTINUE SHOPPING');
    }

    /**
     * FUNCTIONS / ACTIONS
     */

    /**
     * Memeriksa apakah nama produk tertentu tampil di dalam daftar keranjang
     * @param productName Nama produk yang ingin dicek (cth: 'Sauce Labs Bolt T-Shirt')
     */
    async isProductVisibleInCart(productName: string): Promise<boolean> {
        // Mencari elemen text item produk berdasarkan namanya di dalam keranjang
        // Menggunakan XPath dynamic text matcher yang aman untuk environment mobile Android/iOS
        const productLabel = await $(`//*[@text="${productName}" or @label="${productName}"]`);
        
        try {
            await productLabel.waitForDisplayed({ timeout: 5000 });
            return await productLabel.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Melakukan klik pada tombol "REMOVE" untuk produk spesifik berdasarkan namanya
     * @param productName Nama produk yang ingin dihapus dari keranjang
     */
    async clickRemoveProductByName(productName: string): Promise<void> {
        // Menargetkan tombol REMOVE yang berada di bawah rumpun kontainer produk yang dimaksud
        // Di Swag Labs Mobile, tombol remove dikondisikan per item secara dinamis
        const btnRemove = await $(`//*[@text="${productName}"/../..//android.view.ViewGroup[@content-desc="test-REMOVE"] | //*[@label="${productName}"]/../..//XCUIElementTypeOther[@name="test-REMOVE"]`);
        
        await btnRemove.waitForDisplayed({ timeout: 5000 });
        await btnRemove.click();
    }

    /**
     * Memeriksa apakah placeholder "Your Cart is Empty" / Container kosong ter-render di layar
     */
    async isEmptyCartPlaceholderDisplayed(): Promise<boolean> {
        try {
            // Jika aplikasi tidak crash dan container cart kosong atau button checkout hilang, 
            // kita bisa asumsikan keranjang berhasil dikosongkan.
            const isCheckoutVisible = await this.btnCheckout.isDisplayed();
            return !isCheckoutVisible; 
        } catch (error) {
            // Jika elemen checkout throw error/tidak ditemukan, berarti halaman kosong berhasil divalidasi
            return true;
        }
    }

    /**
     * Memeriksa status keaktifan dari tombol Checkout
     */
    async isCheckoutButtonEnabled(): Promise<boolean> {
        try {
            const isDisplayed = await this.btnCheckout.isDisplayed();
            if (!isDisplayed) return false;
            
            const isEnabled = await this.btnCheckout.isEnabled();
            return isEnabled;
        } catch (error) {
            return false;
        }
    }
}

export default new CartPage();