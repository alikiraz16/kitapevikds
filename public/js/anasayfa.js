window.onload = function () {
    // İlk grafik (Satış ve Masraf)
    fetch('/api/sales-expenses')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const labels = data.map(item => item.sube_ad); // Şube adları
            const salesData = data.map(item => item.toplam_gelir); // Toplam gelir verisi
            const expensesData = data.map(item => item.masraf_toplam); // Toplam masraf verisi

            const ctx = document.getElementById('salesExpensesChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',  // Sütun grafiği
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Toplam Gelir',
                            data: salesData,
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',  // Sütun rengi
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            yAxisID: 'y1'
                        },
                        {
                            label: 'Toplam Masraf',
                            data: expensesData,
                            type: 'line',  // Çizgi grafiği
                            fill: false,
                            borderColor: 'rgba(255, 99, 132, 1)',  // Çizgi rengi
                            tension: 0.1,
                            yAxisID: 'y1'  // y2'yi y1 ile eşitleyerek sağdaki ekseni kaldırıyoruz
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y1: {
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Veri çekilirken hata oluştu:', error);
        });

    // Yeni Grafik (Toplam Satış)
    fetch('/api/total-sales')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const labels = data.map(item => item.sube_ad); // Şube adları
            const salesData = data.map(item => item.toplam_satis); // Toplam satış verisi

            const ctx = document.getElementById('totalSalesChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',  // Sütun grafiği
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Toplam Satış',
                            data: salesData,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',  // Sütun rengi
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Veri çekilirken hata oluştu:', error);
        });

    // En Çok Kar Eden 3 Şube
    fetch('/api/most-profitable')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const labels = data.map(item => item.branch_name); // Şube adları
            const profitData = data.map(item => item.profit); // Kar verisi

            const ctx = document.getElementById('mostProfitableChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',  // Sütun grafiği
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'En Çok Kar Eden Şubeler',
                            data: profitData,
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',  // Sütun rengi
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Veri çekilirken hata oluştu:', error);
        });

    // En Az Kar Eden 3 Şube
    fetch('/api/least-profitable')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const labels = data.map(item => item.branch_name); // Şube adları
            const profitData = data.map(item => item.profit); // Kar verisi

            const ctx = document.getElementById('leastProfitableChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',  // Sütun grafiği
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'En Az Kar Eden Şubeler',
                            data: profitData,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',  // Sütun rengi
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Veri çekilirken hata oluştu:', error);
        });
};

    // Şubelerin ilçeleri verisini çekme
    fetch('/api/branches-districts')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('branchesTable').getElementsByTagName('tbody')[0];
            data.forEach(item => {
                const row = tableBody.insertRow();
                const branchCell = row.insertCell(0);
                const districtCell = row.insertCell(1);

                branchCell.textContent = item.sube_ad;
                districtCell.textContent = item.ilce_ad;
            });
        })
        .catch(error => {
            console.error('Veri çekilirken hata oluştu:', error);
        });


const populationMap = L.map('population-map').setView([38.4237, 27.1428], 10); // İzmir'in koordinatları

// Tile layer (harita katmanı)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(populationMap);

// Nüfus verileri
const populationData = {
    "Aliağa": 106000,
    "Balçova": 81000,
    "Bayındır": 40100,
    "Bergama": 107000,
    "Beydağ": 11900,
    "Bornova": 525000,
    "Çeşme": 49500,
    "Çiğli": 216000,
    "Dikili": 54000,
    "Foça": 35500,
    "Gazemir": 139000,
    "Güzelbahçe": 88000,
    "Karaburun": 12500,
    "Karşıyaka": 500000,
    "Kemalpaşa": 125000,
    "Kiraz": 43000,
    "Konak": 720000,
    "Menemen": 125000,
    "Narlıdere": 110000,
    "Seferihisar": 43000,
    "Selçuk": 35500,
    "Torbalı": 50000,
    "Urla": 76000,
    "Bayraklı": 330000,
    "Buca": 525000,
    "Karabağlar": 400000,
    "Menderes": 80000,
    "Tire": 100000,
    "Ödemiş": 120000,
};

// Yoğunluk değerlerine göre renk ataması
const getColor = (density) => {
    return density > 450000 ? 'red' :
        density > 300000 ? 'blue' :
            'green';
};

// İlçeler için konum bilgileri
const districts = [
    { name: 'Aliağa', lat: 38.7996, lon: 26.9707 },
    { name: 'Balçova', lat: 38.3891, lon: 27.0500 },
    { name: 'Bayındır', lat: 38.2178, lon: 27.6478 },
    { name: 'Bergama', lat: 39.1214, lon: 27.1799 },
    { name: 'Beydağ', lat: 38.0847, lon: 28.2106 },
    { name: 'Bornova', lat: 38.4710, lon: 27.2177 },
    { name: 'Çeşme', lat: 38.3243, lon: 26.3032 },
    { name: 'Çiğli', lat: 38.4940, lon: 26.9617 },
    { name: 'Dikili', lat: 39.0749, lon: 26.8892 },
    { name: 'Foça', lat: 38.6704, lon: 26.7579 },
    { name: 'Gazemir', lat: 38.3253, lon: 27.1219 },
    { name: 'Güzelbahçe', lat: 38.3626, lon: 26.8825 },
    { name: 'Karaburun', lat: 38.6383, lon: 26.5127 },
    { name: 'Karşıyaka', lat: 38.4555, lon: 27.1199 },
    { name: 'Kemalpaşa', lat: 38.4275, lon: 27.4188 },
    { name: 'Kiraz', lat: 38.2302, lon: 28.2064 },
    { name: 'Konak', lat: 38.4177, lon: 27.1283 },
    { name: 'Menemen', lat: 38.6104, lon: 27.0697 },
    { name: 'Narlıdere', lat: 38.3967, lon: 26.9970 },
    { name: 'Seferihisar', lat: 38.1952, lon: 26.8344 },
    { name: 'Selçuk', lat: 37.9508, lon: 27.3700 },
    { name: 'Torbalı', lat: 38.1558, lon: 27.3646 },
    { name: 'Urla', lat: 38.3250, lon: 26.7668 },
    { name: 'Bayraklı', lat: 38.4612, lon: 27.1881 },
    { name: 'Buca', lat: 38.363411, lon: 27.205820 },
    { name: 'Karabağlar', lat: 38.3968, lon: 27.1307 },
    { name: 'Menderes', lat: 38.2517, lon: 27.1327 },
    { name: 'Tire', lat: 38.0895, lon: 27.7318 },
    { name: 'Ödemiş', lat: 38.2283, lon: 27.9748 },
    { name: 'Kınık', lat: 39.0859, lon: 27.3818 },
];

// Harita üzerinde ilçeleri göster
districts.forEach(district => {
    const density = populationData[district.name] || 0;
    const color = getColor(density);

    L.circle([district.lat, district.lon], {
        color: color,
        fillColor: color,
        fillOpacity: 0.6,
        radius: 1000
    }).addTo(populationMap).bindPopup(`${district.name} <br> Nüfus: ${populationData[district.name]}`);
});


const map = L.map('map').setView([38.4192, 27.1287], 12); // İzmir koordinatları, zoom seviyesini ayarlayın

// OpenStreetMap katmanını ekleyin
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// API'den şube verilerini çekme
fetch('http://localhost:3000/api/shubeler')
    .then(response => response.json())
    .then(data => {
        data.forEach(sube => {
            // Her şube için enlem ve boylam bilgisiyle işaretçi ekleyin
            const { sube_ad, enlem, boylam } = sube;
            L.marker([enlem, boylam]).addTo(map)
                .bindPopup(`<b>${sube_ad}</b><br>Enlem: ${enlem}<br>Boylam: ${boylam}`)
                .openPopup();
        });
    })
    .catch(error => console.error('Veri alırken hata oluştu: ', error));
