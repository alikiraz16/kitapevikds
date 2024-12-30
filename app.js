const express = require('express');
const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const subelerRoutes = require('./routes/subelerRoutes');  // Şubeler rotasını dahil et
const karsilastirmaRoutes = require('./routes/karsilastirmaRoutes');
const anasayfaRoutes = require('./routes/anasayfaRoutes');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));

// /api altındaki şubeler ve karşılaştırma rotalarını kullanıma sunuyoruz
app.use('/api', subelerRoutes);  // Subeler rotası
app.use('/api', karsilastirmaRoutes);  // Karsilastirma rotası
app.use('/api', anasayfaRoutes);  // Karsilastirma rotası

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor...`);
});