import { $ } from '@wdio/globals'
import Page from './page' 

class LoginPage extends Page {
    get usernameInput () { return $('~test-Username') }
    get passwordInput () { return $('~test-Password') }
    get loginButton () { return $('~test-LOGIN') }
    get errorMessage () {
        return $('-android uiautomator:new UiSelector().className("android.widget.TextView").textContains("user")');
    } 

    async enterUsername (username: string) {
        await this.usernameInput.setValue(username)
    }

    async enterPassword (password: string) {
        await this.passwordInput.setValue(password)
    }

    async clickLogin () {
        await this.loginButton.click()
    }
}

export default new LoginPage()