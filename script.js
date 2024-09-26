const tooltip = document.getElementById('tooltip');

// Функція для отримання курсів валют
async function fetchExchangeRates(baseCurrency) {
    const apiKey = 'f62498e6c28f6fc8a2f20f7e'; // Заміни на свій API ключ
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.conversion_rates; // Повертає об'єкт з курсами
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return null; // Якщо сталася помилка, повертаємо null
    }
}

// Функція для показу курсів при наведенні
async function showTooltip(event) {
    const amount = event.target.getAttribute('data-amount');
    const currency = event.target.getAttribute('data-currency');

    // Отримуємо курси валют
    const rates = await fetchExchangeRates(currency);
    if (!rates) return; // Якщо не вдалося отримати курси, виходимо

    let conversionInfo = '';

    // Основні валюти для відображення
    const mainCurrencies = ['USD', 'EUR', 'GBP'];

    // Генерація інформації для конвертації
    for (const targetCurrency of mainCurrencies) {
        if (targetCurrency !== currency && rates[targetCurrency]) { // Уникаємо показу тієї ж валюти
            const convertedAmount = (amount * rates[targetCurrency]).toFixed(2);
            conversionInfo += `${convertedAmount} ${targetCurrency} <br>`;
        }
    }

    tooltip.innerHTML = conversionInfo;
    tooltip.style.left = `${event.pageX}px`;
    tooltip.style.top = `${event.pageY}px`;
    tooltip.style.display = 'block';
}

// Додаємо обробники подій для кожної валюти
document.querySelectorAll('.currency').forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
});
