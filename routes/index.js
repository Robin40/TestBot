'use strict';

const requestify = require('requestify');
const state = require("./state_machine.js");
const Activity = require("./activity.js");
const express = require('express');
const router = express.Router();
const bot = require('./bot.js');
const User = require('./User.js');


router.get('/', (req, res) => {
    res.send(req.query['hub.challenge']);
});

const ACCESS_TOKEN = "EAAbCANkytUYBAOhJ3xmXfcqHwajvWy5uhWUmuI0VxIzIJs8hOTxVbzefm2SFb6uL4ZBYjZCuZCKiSnXLJOCxjPBUWrwtUUwrBalm8dqy36oorFGP4KiJA7iBhE556Q1iENzyesZCuQMPeChyvoMpw8P9leibb5SyignjJqjiSQZDZD";

function send(data) {
    return requestify.post("https://graph.facebook.com/v2.6/me/messages?access_token=" + ACCESS_TOKEN, data)
        .fail(response => {
            console.log(`fallo la mierda po`, response.getCode());
            return Promise.reject(response.getCode());
        });
}

function send_message(userID, text) {
    return send({
        recipient: {id: userID},
        message: {text: text}
    });
}
const botID = '1701565819859368';

router.post('/', (req, res) => {
    const messaging_events = req.body.entry[0].messaging;

    for (let i = 0; i < messaging_events.length; i++) {
        const event = req.body.entry[0].messaging[i];
        const senderID = event.sender.id;
        if (senderID === botID)
            continue;

        send_message(senderID, "Porfavor hazte amigo de y hablale a Freetime bot: https://www.facebook.com/freetime.bot.9");
    }
    res.sendStatus(200);
});

module.exports = router;
