async function fetchPortfolio() {
    const apiKey = document.getElementById('apiKey').value;
    const baseUrl = 'https://live.trading212.com/api/v0/equity/portfolio'; // Użyj /demo/ dla konta treningowego

    if (!apiKey) return alert("Podaj klucz API!");

    try {
        const response = await fetch(baseUrl, {
            headers: { 'Authorization': apiKey }
        });

        if (!response.ok) throw new Error('Błąd autoryzacji lub API');

        const data = await response.json();
        updateUI(data);
    } catch (err) {
        console.error(err);
        alert("Błąd: Upewnij się, że masz wyłączone blokowanie CORS lub używasz serwera proxy.");
    }
}

function updateUI(holdings) {
    const tbody = document.querySelector('#holdingsTable tbody');
    tbody.innerHTML = '';
    
    let totalVal = 0;
    let totalPnl = 0;
    const labels = [];
    const values = [];

    holdings.forEach(item => {
        const row = `<tr>
            <td>**${item.ticker}**</td>
            <td>${item.quantity}</td>
            <td>${item.averagePrice.toFixed(2)}</td>
            <td style="color: ${item.ppl >= 0 ? 'green' : 'red'}">${item.ppl.toFixed(2)}</td>
        </tr>`;
        tbody.innerHTML += row;

        totalVal += (item.quantity * item.currentPrice);
        totalPnl += item.ppl;
        labels.push(item.ticker);
        values.push(item.quantity * item.currentPrice);
    });

    document.getElementById('totalValue').innerText = `${totalVal.toFixed(2)} PLN`;
    document.getElementById('totalPnl').innerText = `${totalPnl.toFixed(2)} PLN`;

    renderChart(labels, values);
}

function renderChart(labels, data) {
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
            }]
        }
    });
}
