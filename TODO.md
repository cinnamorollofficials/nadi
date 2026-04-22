1. Monitor AI token usage
2. Implement token limit
   - Admin can set custom limit for user
   - User can see their token usage
   - User can't use AI if token limit is reached
3. Implement Symtomp checker
   - Ask personal health data before using AI
   - ...
4. handle queue kalau user yang menggunakan rame
5. consider spawn multiplen ai worker untuk handle banyak request
6. sediakan fitur, generate new response dan kirim ulang kalau ai gagal respon
7. buatkan plan untuk memberikan estima biaya dan harga untuk pengobatan bersadarkan penyakitnya
8. minta lokasi pengguna untuk memberikan saran rumah sakit atau klinik terdekta untuk pengobatan
9. buatkan fitur export result dari symtomp
10. buatkan plan untuk hemat token ai dan performa untuk meminimkan respon gagal
11. monitor juga respon ai yang berhasil dan gagal untuk dianalisa



Deployment step:
1. git pull main
2. build frontend
3. stop nadi service
4. delete and create database (optional)
5. run migration
6. run seeder
7. build nadi
8. start nadi service
9. tes login
10. test chat konsultasi


Required QA
1. register by email
2. login by email
3. register by google account
4. login by google account
5. start ai consultation
6. start ai consultation from medicpedia
7. start ai symtomp checker
