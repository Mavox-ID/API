const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Функция для получения токена доступа
async function getAccessToken() {
    const response = await axios.post('https://api.sendpulse.com/oauth/access_token', {
        grant_type: 'client_credentials',
        client_id: 'YOUR_API_ID', // Замените на ваш API ID
        client_secret: 'YOUR_API_SECRET' // Замените на ваш API Secret
    });
    return response.data.access_token;
}

app.post('/add_ecogreen', async (req, res) => {
    const amount = req.body.amount;
    console.log(`Получено: ${amount} Ecogreen`);

    // Проверка, что количество равно 100
    if (amount === 100) {
        try {
            const accessToken = await getAccessToken();
            const response = await axios.post('https://api.sendpulse.com/your_endpoint', {
                amount: amount,
                // Другие необходимые параметры
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}` // Используем токен доступа
                }
            });

            res.send('Ecogreen добавлено!');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка при добавлении Ecogreen');
        }
    } else {
        res.status(400).send('Некорректное количество');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});