document.addEventListener('DOMContentLoaded', function () {
    let chartInstance = null;  // Grafik nesnesini burada tanımlıyoruz (global değişken olarak)
    let chartInstanceMasraf = null;  // Masraflar grafiği için yeni bir nesne tanımlıyoruz
    let chartInstanceKar = null;  // Karlar grafiği için yeni bir nesne tanımlıyoruz

    // Şubeleri veritabanından almak için API'yi çağırıyoruz
    fetch('/api/subeler')  // /api/subeler yoluna istek gönderiyoruz
        .then(response => response.json())  // Yanıtı JSON olarak alıyoruz
        .then(data => {
            const sube1Select = document.getElementById('sube1');
            const sube2Select = document.getElementById('sube2');

            data.forEach(sube => {
                const option1 = document.createElement('option');
                option1.value = sube.sube_id;
                option1.textContent = sube.sube_ad;
                sube1Select.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = sube.sube_id;
                option2.textContent = sube.sube_ad;
                sube2Select.appendChild(option2);
            });
        })
        .catch(error => console.error('Şubeler yüklenirken bir hata oluştu:', error));

    // Form gönderildiğinde karşılaştırma işlemini yap
    document.getElementById('comparisonForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const sube1 = document.getElementById('sube1').value;
        const sube2 = document.getElementById('sube2').value;

        // Satış karşılaştırması için API'ye istek gönder
        fetch(`/api/karsilastirSatis?sube1=${sube1}&sube2=${sube2}`)
            .then(response => response.json())
            .then(data => {
                const salesData = {
                    labels: ['2021', '2022', '2023', '2024'],
                    datasets: [
                        {
                            label: 'Şube 1 Geliri',
                            data: [
                                data[0].satis_2021 || 0,
                                data[0].satis_2022 || 0,
                                data[0].satis_2023 || 0,
                                data[0].satis_2024 || 0
                            ],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Şube 2 Geliri',
                            data: [
                                data[1].satis_2021 || 0,
                                data[1].satis_2022 || 0,
                                data[1].satis_2023 || 0,
                                data[1].satis_2024 || 0
                            ],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ]
                };

                if (chartInstance) {
                    chartInstance.destroy();
                }

                const ctx = document.getElementById('salesChart').getContext('2d');
                chartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: salesData,
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
            .catch(err => console.error('Hata:', err));

        // Masraf karşılaştırması için API'ye istek gönder
        fetch(`/api/karsilastirMasraf?sube1=${sube1}&sube2=${sube2}`)
            .then(response => response.json())
            .then(data => {
                const expenseData = {
                    labels: ['2021', '2022', '2023', '2024'],
                    datasets: [
                        {
                            label: 'Şube 1 Masrafı',
                            data: [
                                data[0].masraf_2021 || 0,
                                data[0].masraf_2022 || 0,
                                data[0].masraf_2023 || 0,
                                data[0].masraf_2024 || 0
                            ],
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Şube 2 Masrafı',
                            data: [
                                data[1].masraf_2021 || 0,
                                data[1].masraf_2022 || 0,
                                data[1].masraf_2023 || 0,
                                data[1].masraf_2024 || 0
                            ],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }
                    ]
                };

                if (chartInstanceMasraf) {
                    chartInstanceMasraf.destroy();
                }

                const ctxMasraf = document.getElementById('expenseChart').getContext('2d');
                chartInstanceMasraf = new Chart(ctxMasraf, {
                    type: 'bar',
                    data: expenseData,
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
            .catch(err => console.error('Hata:', err));

        // Kar karşılaştırması için API'ye istek gönder
        fetch(`/api/karsilastirKar?sube1=${sube1}&sube2=${sube2}`)
            .then(response => response.json())
            .then(data => {
                const profitData = {
                    labels: ['2021', '2022', '2023', '2024'],
                    datasets: [
                        {
                            label: 'Şube 1 Karı',
                            data: [
                                data[0].profit || 0,
                                data[1].profit || 0,
                                data[2].profit || 0,
                                data[3].profit || 0
                            ],
                            backgroundColor: 'rgba(153, 102, 255, 0.2)', // Şube 1 için mor renk
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Şube 2 Karı',
                            data: [
                                data[4].profit || 0,
                                data[5].profit || 0,
                                data[6].profit || 0,
                                data[7].profit || 0
                            ],
                            backgroundColor: 'rgba(255, 159, 64, 0.2)', // Şube 2 için turuncu renk
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1
                        }
                    ]
                };

                if (chartInstanceKar) {
                    chartInstanceKar.destroy();
                }

                const ctxKar = document.getElementById('profitChart').getContext('2d');
                chartInstanceKar = new Chart(ctxKar, {
                    type: 'bar',
                    data: profitData,
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
            .catch(err => console.error('Hata:', err));
    });
});