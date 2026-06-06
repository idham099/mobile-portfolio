import { browser } from '@wdio/globals'

//ini file induk untuk semua page object
export default class Page {
    async waitForElement (element: WebdriverIO.Element, timeoutMs = 5000) {
        await element.waitForDisplayed({ timeout: timeoutMs })
    }
}