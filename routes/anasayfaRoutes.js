const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Şubeler için satış ve masraf verilerini almak
router.get('/sales-expenses', (req, res) => {
    const querySales =
    `
        SELECT sube.sube_ad, SUM(satislar.fiyat) as toplam_gelir
        FROM sube, satislar
        WHERE satislar.sube_id = sube.sube_id
        GROUP BY sube.sube_id;`
    const queryExpenses =
    `
        SELECT sube.sube_ad, SUM(masraf.masraf_tutari) as masraf_toplam
        FROM masraf, sube
        WHERE masraf.sube_id = sube.sube_id
        GROUP BY sube.sube_id;`
    

    // İlk sorguyu çalıştırıyoruz (Satış verisi)
    db.query(querySales, (err, salesResults) => {
        if (err) {
            return res.status(500).json({ message: "Veritabanı hatası (Satışlar)", error: err });
        }

        // İkinci sorguyu çalıştırıyoruz (Masraf verisi)
        db.query(queryExpenses, (err, expenseResults) => {
            if (err) {
                return res.status(500).json({ message: "Veritabanı hatası (Masraflar)", error: err });
            }

            // Satışlar ve masrafları birleştiriyoruz
            const results = salesResults.map(sale => {
                const expense = expenseResults.find(exp => exp.sube_ad === sale.sube_ad);
                return {
                    sube_ad: sale.sube_ad,
                    toplam_gelir: sale.toplam_gelir,
                    masraf_toplam: expense ? expense.masraf_toplam : 0
                };
            });

            res.json(results); // Birleştirilmiş veriyi frontend'e gönderiyoruz
        });
    });
});

// Şubeler için toplam satış verilerini almak
router.get('/total-sales', (req, res) => {
    const querySales = `
        SELECT sube.sube_ad, COUNT(satislar.satis_id) as toplam_satis
        FROM sube, satislar
        WHERE satislar.sube_id=sube.sube_id
        GROUP BY sube.sube_id;
    `;

    db.query(querySales, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Veritabanı hatası (Toplam Satışlar)", error: err });
        }
        res.json(results); // Toplam satış verilerini frontend'e gönderiyoruz
    });
});

// En çok kar eden 4 şubeyi almak
router.get('/most-profitable', (req, res) => {
    const queryMostProfitable = `
        SELECT
            sube.sube_ad AS branch_name,  -- Şube adı
            SUM(satislar.fiyat) AS total_sales,  -- Toplam satış fiyatı
            -- Toplam masrafı şube bazında gruplayarak alıyoruz
            (SELECT SUM(COALESCE(masraf.masraf_tutari, 0))
             FROM masraf
             WHERE masraf.sube_id = satislar.sube_id) AS total_expenses,
            SUM(satislar.fiyat) - 
            (SELECT SUM(COALESCE(masraf.masraf_tutari, 0))
             FROM masraf
             WHERE masraf.sube_id = satislar.sube_id) AS profit  -- Toplam kar
        FROM
            satislar
        JOIN kitaplar ON satislar.kitap_id = kitaplar.kitap_id  -- Kitaplar tablosu ile ilişki
        JOIN sube ON satislar.sube_id = sube.sube_id  -- Şube adı için sube tablosu ile ilişki
        GROUP BY
            satislar.sube_id  -- Sadece şube bazında grupla
        ORDER BY
            profit DESC
        LIMIT 4;
    `;

    db.query(queryMostProfitable, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Veritabanı hatası (En Çok Kar Eden Şubeler)", error: err });
        }
        res.json(results); // En çok kar eden 3 şubeyi frontend'e gönderiyoruz
    });
});

// En az kar eden 4 şubeyi almak
router.get('/least-profitable', (req, res) => {
    const queryLeastProfitable = `
        SELECT
            sube.sube_ad AS branch_name,  -- Şube adı
            SUM(satislar.fiyat) AS total_sales,  -- Toplam satış fiyatı
            -- Toplam masrafı şube bazında gruplayarak alıyoruz
            (SELECT SUM(COALESCE(masraf.masraf_tutari, 0))
             FROM masraf
             WHERE masraf.sube_id = satislar.sube_id) AS total_expenses,
            SUM(satislar.fiyat) - 
            (SELECT SUM(COALESCE(masraf.masraf_tutari, 0))
             FROM masraf
             WHERE masraf.sube_id = satislar.sube_id) AS profit  -- Toplam kar
        FROM
            satislar
        JOIN kitaplar ON satislar.kitap_id = kitaplar.kitap_id  -- Kitaplar tablosu ile ilişki
        JOIN sube ON satislar.sube_id = sube.sube_id  -- Şube adı için sube tablosu ile ilişki
        GROUP BY
            satislar.sube_id  -- Sadece şube bazında grupla
        ORDER BY
            profit ASC
        LIMIT 4;
    `;

    db.query(queryLeastProfitable, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Veritabanı hatası (En Az Kar Eden Şubeler)", error: err });
        }
        res.json(results); // En az kar eden 3 şubeyi frontend'e gönderiyoruz
    });
});

// Şubelerin ilçeleriyle birlikte verilerini almak
router.get('/branches-districts', (req, res) => {
    const query = `
        SELECT sube.sube_ad, ilceler.ilce_ad
        FROM ilceler
        INNER JOIN sube ON sube.ilce_id = ilceler.ilce_id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Veritabanı hatası (Şube ve İlçe)", error: err });
        }
        res.json(results); // Şube ve ilçeleri frontend'e gönderiyoruz
    });
});

router.get('/shubeler', (req, res) => {  // 'app.get' yerine 'router.get' kullanıyoruz
    const query = 'SELECT sube_ad, enlem, boylam FROM sube';  // Şube adı, enlem ve boylam bilgilerini seçiyoruz.
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Veri alınırken hata oluştu.');
        } else {
            res.json(results); // JSON olarak döndürüyoruz
        }
    });
});


module.exports = router;