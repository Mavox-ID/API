const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/add_ecogreen', async (req, res) => {
    const amount = req.body.amount;
    console.log(`Добавлено ${amount} Ecogreen на аккаунт!`);

    // Здесь добавьте логику для обновления аккаунта в SendPulse
    try {
        const response = await axios.post('https://api.sendpulse.com/your_endpoint', {
            // Ваши данные для API SendPulse
            amount: amount,
            // Другие необходимые параметры
        }, {
            headers: {
                'Authorization': 'Bearer YOUR_API_KEY' // Замените на ваш API-ключ
            }
        });

        res.send('Ecogreen добавлено!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при добавлении Ecogreen');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});