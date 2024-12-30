const express = require('express');
const router = express.Router();  // router'ı burada tanımlıyoruz
const db = require('../config/db');  // MySQL veritabanı bağlantınız

// Satış Miktarlarını almak için API endpointi
router.get('/sales', (req, res) => {
    const { year, quarter } = req.query;
    const startMonth = quarter && quarter !== 'all' ? (quarter - 1) * 3 + 1 : 1;
    const endMonth = quarter && quarter !== 'all' ? quarter * 3 : 12;

    const query = `
    SELECT sube.sube_ad, COUNT(satislar.satis_id) AS satis_miktari
    FROM sube
    LEFT JOIN satislar ON sube.sube_id = satislar.sube_id
    WHERE YEAR(satislar.satis_tarihi) = ? 
    AND MONTH(satislar.satis_tarihi) BETWEEN ? AND ?
    GROUP BY sube.sube_id
    `;

    db.query(query, [year, startMonth, endMonth], (err, results) => {
        if (err) {
            console.error('Veri çekme hatası: ', err);
            res.status(500).json({ error: 'Veri çekme hatası' });
            return;
        }
        res.json(results);  // Şubelerin satış verilerini JSON olarak gönder
    });
});

// Satış gelirlerini almak için API endpointi
router.get('/gelir', (req, res) => {
    const { year, quarter } = req.query;
    const startMonth = quarter && quarter !== 'all' ? (quarter - 1) * 3 + 1 : 1;
    const endMonth = quarter && quarter !== 'all' ? quarter * 3 : 12;

    const query = `
    SELECT sube.sube_ad, SUM(satislar.fiyat) AS toplam_gelir
    FROM sube
    LEFT JOIN satislar ON sube.sube_id = satislar.sube_id
    WHERE YEAR(satislar.satis_tarihi) = ? 
    AND MONTH(satislar.satis_tarihi) BETWEEN ? AND ?
    GROUP BY sube.sube_id
    `;

    db.query(query, [year, startMonth, endMonth], (err, results) => {
        if (err) {
            console.error('Veri çekme hatası: ', err);
            res.status(500).json({ error: 'Veri çekme hatası' });
            return;
        }
        res.json(results);  // Şubelerin gelir verilerini JSON olarak gönder
    });
});

// Masrafları almak için API endpointi
router.get('/masraflar', (req, res) => {
    const { year, quarter } = req.query;
    const startMonth = quarter && quarter !== 'all' ? (quarter - 1) * 3 + 1 : 1;
    const endMonth = quarter && quarter !== 'all' ? quarter * 3 : 12;

    const query = `
    SELECT sube.sube_ad, SUM(masraf.masraf_tutari) AS toplam_masraf
    FROM sube
    LEFT JOIN masraf ON sube.sube_id = masraf.sube_id
    WHERE YEAR(masraf.masraf_tarihi) = ? 
    AND MONTH(masraf.masraf_tarihi) BETWEEN ? AND ?
    GROUP BY sube.sube_id
    `;

    db.query(query, [year, startMonth, endMonth], (err, results) => {
        if (err) {
            console.error('Veri çekme hatası: ', err);
            res.status(500).json({ error: 'Veri çekme hatası' });
            return;
        }
        res.json(results);  // Şubelerin masraf verilerini JSON olarak gönder
    });
});

// Şubelerin enlem ve boylam bilgilerini API üzerinden döndürme
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

module.exports = router;  // router'ı dışa aktarın
