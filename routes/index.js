const express = require('express');
const router = express.Router();
const bot = require('./bot.js');
const User = require('./User.js');


router.get('/', (req, res) => {
    res.send(req.query['hub.challenge']);
});


const botID = '1701565819859368';

router.post('/', (req, res) => {
    const messaging_events = req.body.entry[0].messaging;

    for (let i = 0; i < messaging_events.length; i++) {
        const event = req.body.entry[0].messaging[i];
        const senderID = event.sender.id;
        if (senderID === botID)
            continue;
        const sender = User.byID[senderID] || new User(senderID);
        User.byID[senderID] = sender;

        if (event.message && event.message.text) {
            const text = event.message.text;
            bot.process_message(sender, text);
        } else if (event.postback && event.postback.payload) {
            const payload = event.postback.payload;
            bot.process_payload(sender, payload);
        }
    }
    res.sendStatus(200);
});

module.exports = router;
