const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Токен вашего бота
const BOT_TOKEN = '7562219180:AAHMeEi8eAhh4W9Uq03imtmMLVDk075YPr0';
const CHAT_ID = '7809611963'; // Замените на ваш Telegram chat_id (узнаем позже)

// Парсим тело запроса
app.use(bodyParser.urlencoded({ extended: true }));

// Эндпоинт для уведомлений от YooMoney
app.post('/notify', async (req, res) => {
    console.log('Received notification:', req.body);
    const orderId = req.body.label;

    if (orderId) {
        // Отправляем уведомление в Telegram
        const message = `Payment received for order #${orderId}`;
        try {
            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: message
            });
            console.log('Notification sent to Telegram');
        } catch (error) {
            console.error('Error sending to Telegram:', error);
        }
    }

    res.send('OK');
});

// Запускаем сервер
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});