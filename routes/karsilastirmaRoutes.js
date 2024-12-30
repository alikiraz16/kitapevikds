const express = require('express');
const router = express.Router();
const db = require('../config/db');  // MySQL veritabanı bağlantınız

// Şubeleri veritabanından çeken rota
router.get('/subeler', (req, res) => {
    const query = "SELECT sube_id, sube_ad FROM kitapevikds.sube";  // Şubeleri çekmek için sorgu

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Veritabanı hatası: ' + err);  // Hata durumunda yanıt
        }
        res.json(results);  // Şubeleri JSON formatında döndürüyoruz
    });
});

// Satış karşılaştırma rotası
router.get('/karsilastirSatis', (req, res) => {
    const { sube1, sube2 } = req.query;

    if (!sube1 || !sube2) {
        return res.status(400).send('Lütfen tüm parametreleri girin: sube1, sube2');
    }

    // SQL sorgusu, seçilen yıllara göre satışları karşılaştıracak
    const query = `
        SELECT
            satislar.sube_id,
            SUM(CASE WHEN YEAR(satislar.satis_tarihi) = 2021 THEN satislar.fiyat ELSE 0 END) AS satis_2021,
            SUM(CASE WHEN YEAR(satislar.satis_tarihi) = 2022 THEN satislar.fiyat ELSE 0 END) AS satis_2022,
            SUM(CASE WHEN YEAR(satislar.satis_tarihi) = 2023  THEN satislar.fiyat ELSE 0 END) AS satis_2023,
            SUM(CASE WHEN YEAR(satislar.satis_tarihi) = 2024 THEN satislar.fiyat ELSE 0 END) AS satis_2024
        FROM satislar
        WHERE satislar.sube_id IN (?, ?)
        GROUP BY satislar.sube_id;
    `;

    db.query(query, [sube1, sube2], (err, results) => {
        if (err) {
            return res.status(500).send('Veritabanı hatası: ' + err);
        }

        // Sonuçları kullanıcıya döndür
        res.json(results);
    });
});

router.get('/karsilastirMasraf', (req, res) => {
    const { sube1, sube2 } = req.query;

    if (!sube1 || !sube2) {
        return res.status(400).send('Lütfen tüm parametreleri girin: sube1, sube2');
    }

    // SQL sorgusu, seçilen yıllara göre masrafları karşılaştıracak
    const query = `
        SELECT
            masraf.sube_id,
            SUM(CASE WHEN YEAR(masraf.masraf_tarihi) = 2021 THEN masraf.masraf_tutari ELSE 0 END) AS masraf_2021,
            SUM(CASE WHEN YEAR(masraf.masraf_tarihi) = 2022 THEN masraf.masraf_tutari ELSE 0 END) AS masraf_2022,
            SUM(CASE WHEN YEAR(masraf.masraf_tarihi) = 2023 THEN masraf.masraf_tutari ELSE 0 END) AS masraf_2023,
            SUM(CASE WHEN YEAR(masraf.masraf_tarihi) = 2024 THEN masraf.masraf_tutari ELSE 0 END) AS masraf_2024
        FROM masraf
        WHERE masraf.sube_id IN (?, ?)
        GROUP BY masraf.sube_id;
    `;

    db.query(query, [sube1, sube2], (err, results) => {
        if (err) {
            return res.status(500).send('Veritabanı hatası: ' + err);
        }

        // Sonuçları kullanıcıya döndür
        res.json(results);
    });
});

router.get('/karsilastirKar', (req, res) => {
    const { sube1, sube2 } = req.query;

    if (!sube1 || !sube2) {
        return res.status(400).json({ error: 'Lütfen tüm parametreleri girin: sube1, sube2' });
    }

    // SQL sorgusu, satışlar ve masraflar arasında fark alarak karları hesaplayacak
    const query = `
        SELECT
            YEAR(satislar.satis_tarihi) AS yil,  -- Yıl bilgisi
            sube.sube_ad AS branch_name,  -- Şube adı
            SUM(satislar.fiyat) AS total_sales,  -- Toplam satış fiyatı
            -- Toplam masrafı yıl ve şube bazında gruplayarak alıyoruz
            (SELECT SUM(COALESCE(masraf.masraf_tutari, 0))
             FROM masraf
             WHERE YEAR(masraf.masraf_tarihi) = YEAR(satislar.satis_tarihi)
               AND masraf.sube_id = satislar.sube_id) AS total_expenses,
            SUM(satislar.fiyat) - 
            (SELECT SUM(COALESCE(masraf.masraf_tutari, 0))
             FROM masraf
             WHERE YEAR(masraf.masraf_tarihi) = YEAR(satislar.satis_tarihi)
               AND masraf.sube_id = satislar.sube_id) AS profit  -- Yıllık kar
        FROM
            satislar
        JOIN kitaplar ON satislar.kitap_id = kitaplar.kitap_id  -- Kitaplar tablosu ile ilişki
        JOIN sube ON satislar.sube_id = sube.sube_id  -- Şube adı için sube tablosu ile ilişki
        WHERE
            YEAR(satislar.satis_tarihi) IN (2021, 2022, 2023, 2024)  -- Yıl filtresi
            AND satislar.sube_id IN (?, ?)  -- İlgili şubeler
        GROUP BY
            satislar.sube_id, YEAR(satislar.satis_tarihi)  -- Şube ve yıl bazında grupla;
    `;

    db.query(query, [sube1, sube2], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ error: 'Veritabanı hatası: ' + err });
        }

        // Sonuçları JSON olarak döndürüyoruz
        res.json(results);
    });
});


module.exports = router;
