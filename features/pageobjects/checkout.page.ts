import { $ } from '@wdio/globals';

class CheckoutPage {
    get inputFirstName() { return $('~test-First Name'); }
    get inputLastName() { return $('~test-Last Name'); }
    get inputZipCode() { return $('~test-Zip/Postal Code'); }
    
    // Gunakan textContains agar lebih toleran terhadap perubahan kecil
    get headerCheckoutInfo() { return $('android=new UiSelector().text("CHECKOUT: INFORMATION")'); }
    get headerOverview() { return $('android=new UiSelector().text("CHECKOUT: OVERVIEW")'); }
    get headerComplete() { return $('android=new UiSelector().text("CHECKOUT: COMPLETE!")'); }
    
    get btnContinue() { return $('~test-CONTINUE'); }
    get btnFinish() { return $('~test-FINISH'); }
    get btnBackHome() { return $('~test-BACK HOME'); }
    
    get errorMessage() { return $('android=//android.view.ViewGroup[@content-desc="test-Error message"]');}
    get productDashboard() { return $('android=new UiSelector().text("PRODUCTS")'); }
    get btnLogout() { return $('~test-LOGOUT'); }
    get menuWidget() { return $('android=new UiSelector().className("android.widget.ImageView").instance(1)');}
}
export default new CheckoutPage();