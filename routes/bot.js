const requestify = require('requestify');

const ACCESS_TOKEN = "EAAbCANkytUYBAOhJ3xmXfcqHwajvWy5uhWUmuI0VxIzIJs8hOTxVbzefm2SFb6uL4ZBYjZCuZCKiSnXLJOCxjPBUWrwtUUwrBalm8dqy36oorFGP4KiJA7iBhE556Q1iENzyesZCuQMPeChyvoMpw8P9leibb5SyignjJqjiSQZDZD";

function send(data) {
    console.log('se ejecuto el send');
    return requestify.post("https://graph.facebook.com/v2.6/me/messages?access_token=" + ACCESS_TOKEN, data)
        .fail(response => {
            console.log(`fallo la mierda po`, response.getCode());
            return Promise.reject(response.getCode());
        });
}

function send_message(userId, text) {
    return send({
        recipient: {id: userId},
        message: {text: text}
    });
}

function get_data_of(userId) {
    return requestify.get(`https://graph.facebook.com/v2.6/${userId}? fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${ACCESS_TOKEN}`).then(response => {
        console.log('response');
        return response.getBody();
    }).fail(response => {
        console.log('fail');
        return Promise.reject(response.getCode());
    });
}

function send_picture(userId) {
    return get_data_of(userId).then(json => {
        const photo = json.profile_pic;
        return send({
            recipient: {id: userId},
            message: {
                attachment: {
                    type: "image",
                    payload: {url: photo}
                }
            }
        });
    }).catch(code => {
        console.log(`send picture failed with ${code}`);
    });
}

function send_buttons(userId) {
    console.log('send_buttons');
    return send({
        recipient: {id: userId},
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "What do you want to do next?",
                    buttons: [
                        {
                            type: "web_url",
                            url: ":http://google.com/",
                            title: "Go to Google"
                        },
                        {
                            type: "postback",
                            title: "I want ...",
                            payload: "I_WANT"
                        }
                    ]
                }
            }
        }
    }).then(() => {
        console.log('se ejecuto este then');
    });
}

function greet(userId) {
    return get_data_of(userId).then(userData => {
        const text = `Hi ${userData.first_name}!`;
        send_message(userId, text);
    });
}

function process_message(sender, text) {
    send_message(sender, `You said: ${text}`);
    greet(sender);
    send_picture(sender);
    send_buttons(sender);
}

function process_payload(sender, payload) {
    send_message(sender, `You pressed ${payload}`);
}

module.exports = {
    process_message: process_message,
    process_payload: process_payload
};