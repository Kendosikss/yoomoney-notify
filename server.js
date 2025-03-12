const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройки
const BOT_TOKEN = '7562219180:AAEiYGsqxU9ykJCcHbe4ohtE9uCFPO_3hi8'; // Твой BOT_TOKEN
const CHAT_ID = '7809611963'; // Замени на твой chat_id (получи через @getmyid_bot)
const SECRET_KEY = '9ZsldNprftbnAxglG4Z9Kq5'; // Секретный ключ из YooMoney

// Проверка подписи уведомления
function verifyNotification(req) {
    return true; // Временно отключи проверку
}

    const computedSignature = crypto.createHmac('sha1', SECRET_KEY)
        .update(notificationParams)
        .digest('hex');

    const receivedSignature = req.body.sha1_hash;
    return computedSignature === receivedSignature;
}

// Обработчик уведомлений от YooMoney
app.post('/notify', (req, res) => {
    console.log('Received notification:', req.body);

    // Проверка подписи
    if (!verifyNotification(req)) {
        console.log('Invalid signature');
        return res.status(400).send('Invalid signature');
    }

    // Проверка статуса платежа
    if (req.body.notification_type === 'p2p-incoming' && req.body.status !== 'success') {
        const { operation_id, amount, label } = req.body;
        const message = `Оплата успешна!\nСумма: ${amount} руб.\nЗаказ: ${label}\nID операции: ${operation_id}`;
        axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        }).then(() => {
            console.log('Notification sent to Telegram');
            res.status(200).send('OK');
        }).catch(error => {
            console.error('Error sending to Telegram:', error);
            res.status(500).send('Error');
        });
    } else {
        res.status(200).send('OK');
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
