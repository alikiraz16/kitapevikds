window.onload = function () {
    const yearSelect = document.getElementById('yearSelect');
    const quarterSelect = document.getElementById('quarterSelect');
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const expensesCtx = document.getElementById('expensesChart').getContext('2d');
    let salesChart;
    let revenueChart;
    let expensesChart;

    // Satış Miktarlarını Çekme (Yıl ve Çeyrek Seçimine Göre)
    function fetchSalesData(year, quarter) {
        let url = `http://localhost:3000/api/sales?year=${year}`;
        if (quarter !== 'all') {
            url += `&quarter=${quarter}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const subeler = data.map(item => item.sube_ad);
                const satisMiktarlari = data.map(item => item.satis_miktari);

                if (salesChart) {
                    salesChart.destroy(); // Eski grafiği temizle
                }

                salesChart = new Chart(salesCtx, {
                    type: 'bar',
                    data: {
                        labels: subeler,
                        datasets: [{
                            label: 'Satış Miktarı',
                            data: satisMiktarlari,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Veri alırken hata oluştu: ', error));
    }

    // Satış Gelirlerini Çekme (Yıl ve Çeyrek Seçimine Göre)
    function fetchRevenueData(year, quarter) {
        let url = `http://localhost:3000/api/gelir?year=${year}`;
        if (quarter !== 'all') {
            url += `&quarter=${quarter}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const subeler = data.map(item => item.sube_ad);
                const toplamGelir = data.map(item => item.toplam_gelir);

                if (revenueChart) {
                    revenueChart.destroy(); // Eski grafiği temizle
                }

                revenueChart = new Chart(revenueCtx, {
                    type: 'bar',
                    data: {
                        labels: subeler,
                        datasets: [{
                            label: 'Satış Geliri',
                            data: toplamGelir,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Veri alırken hata oluştu: ', error));
    }

    // Masrafları Çekme (Yıl ve Çeyrek Seçimine Göre)
    function fetchExpensesData(year, quarter) {
        let url = `http://localhost:3000/api/masraflar?year=${year}`;
        if (quarter !== 'all') {
            url += `&quarter=${quarter}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const subeler = data.map(item => item.sube_ad);
                const toplamMasraf = data.map(item => item.toplam_masraf);

                if (expensesChart) {
                    expensesChart.destroy(); // Eski grafiği temizle
                }

                expensesChart = new Chart(expensesCtx, {
                    type: 'bar',
                    data: {
                        labels: subeler,
                        datasets: [{
                            label: 'Masraflar',
                            data: toplamMasraf,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Veri alırken hata oluştu: ', error));
    }

    // İlk verileri yükle (2024, 1. Çeyrek)
    fetchSalesData(yearSelect.value, quarterSelect.value);
    fetchRevenueData(yearSelect.value, quarterSelect.value);
    fetchExpensesData(yearSelect.value, quarterSelect.value);

    // Filtreler değiştiğinde veriyi yeniden yükle
    yearSelect.addEventListener('change', function () {
        fetchSalesData(yearSelect.value, quarterSelect.value);
        fetchRevenueData(yearSelect.value, quarterSelect.value);
        fetchExpensesData(yearSelect.value, quarterSelect.value);
    });

    quarterSelect.addEventListener('change', function () {
        fetchSalesData(yearSelect.value, quarterSelect.value);
        fetchRevenueData(yearSelect.value, quarterSelect.value);
        fetchExpensesData(yearSelect.value, quarterSelect.value);
    });
};