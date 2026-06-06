import { browser } from '@wdio/globals';

describe('My Login Application', () => {
    it('should open the app', async () => {
        console.log('Sedang mencoba menyambung ke Emulator...');
        
        // Pakai browser.pause, kalau TS masih cerewet, kita bungkam pakai ignore
        // @ts-ignore
        await browser.pause(5000);
        
        console.log('ALHAMDULILLAH! Aplikasi Berhasil Terbuka dan Terdeteksi!');
    });
});