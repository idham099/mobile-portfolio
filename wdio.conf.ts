import path from 'path';

export const config: WebdriverIO.Config = {
    // KUNCI UTAMA: Memaksa WDIO hanya menjalankan satu antrean tunggal (Anti-Paralel)
    maxInstances: 1,
    maxInstancesPerCapability: 1,

    runner: 'local',
    port: 4723,
    hostname: '127.0.0.1',
    path: '/',
    
    specs: [
        './features/**/*.feature' 
    ],
    exclude: [],
    
    connectionRetryTimeout: 180000, 
    connectionRetryCount: 1,        // Beri kesempatan mencoba ulang
    waitforTimeout: 60000,         // Naikkan jadi 60 detik
    
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android', 
        'appium:app': path.resolve('app/app.apk'),
        'appium:appPackage': 'com.swaglabsmobileapp',
        'appium:appActivity': '.MainActivity', // Coba gunakan titik di depan
        'appium:appWaitActivity': '.MainActivity', // Samakan dengan appActivity
        'appium:autoGrantPermissions': true, // Penting untuk bypass popup izin
        
        // Atur ke false agar Appium menginstalkan ulang APK & UiAutomator2 Server yang cocok untuk Android 11
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:enforceAppInstall': false,
        'appium:appWaitDuration': 30000,       
        'appium:uiautomator2ServerLaunchTimeout': 90000, 
        'appium:uiautomator2ServerReadTimeout': 90000,
        'appium:androidInstallTimeout': 120000,
        'appium:adbExecTimeout': 60000,
        'appium:newCommandTimeout': 300
    }],
    
    logLevel: 'info',
    bail: 0,
    framework: 'cucumber',
    
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],
    
    cucumberOpts: {
        require: ['./features/step-definitions/**/*.ts'],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        profile: [],
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },

    mochaOpts: {
    retries: 1
    },
    
    afterStep: async function (step: any, scenario: any, { error, duration, passed }: any) {
        const allureReporter = require('@wdio/allure-reporter').default;

        if (error) {
            try {
                const screenshot = await browser.takeScreenshot();
                allureReporter.addAttachment('Screenshot on Failure', Buffer.from(screenshot, 'base64'), 'image/png');
            } catch (e) {
                console.log("Gagal mengambil screenshot saat error: ", e);
            }
        } 
        else if (step && step.text && step.text.includes('redirected to the Product Dashboard')) {
            try {
                const screenshot = await browser.takeScreenshot();
                allureReporter.addAttachment('Proof: Products Page Opened', Buffer.from(screenshot, 'base64'), 'image/png');
            } catch (e) {
                console.log("Gagal mengambil screenshot untuk bukti: ", e);
            }
        }
    },

    after: async function (result, capabilities, specs) {
        // Tes sudah selesai, sekarang bersihkan sesi untuk tes berikutnya
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.reloadSession();
    },

    afterScenario: async function (world: any, result: any, context: any) {
        // 1. Bersihkan cache aplikasi
        try {
            await browser.execute('mobile: shell', { 
                command: 'pm clear com.swaglabsmobileapp' 
            });
            console.log("Cache aplikasi berhasil dibersihkan.");
        } catch (e) {
            console.log("Gagal membersihkan cache aplikasi: ", e);
        }
    },
};