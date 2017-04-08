const $ = require('requestify');

const ACCESS_TOKEN = "EAAbCANkytUYBAHcOtp4HcKyJfKwdAX1X9NZCjLynZC26u0hSBvoDZAPDOIdmjf8GlcwUSCDn0eQjqfi3undSU6eFfHInckBHCLex8wG5oCsK0iwdOqT0vnKpDKBg0AMy0LOUlEkBGfzoy2iACjczPXBN3QHD0lD1UZB1hyXPygZDZD";

function send(data) {
    return $.post("https://graph.facebook.com/v2.6/me/messages?access_token=" + ACCESS_TOKEN);
}

function send_message(userId, text) {
    return send({
        recipient: {id: userId},
        message: {text: text}
    });
}

function get_user_data(userId) {
    return $.get(`https://graph.facebook.com/v2.6/${userId}`, {
        fields: "first_name,last_name,profile_pic,locale,timezone,gender",
        access_token: ACCESS_TOKEN
    });
}

function send_picture(userId) {
    return get_user_data().then(json => {
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
    });
}

function send_buttons(userId) {
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
    });
}

function greet(userId) {
    return get_user_data(userId).then(userData => {
        const text = `Hi ${userData.first_name}!`;
        send_message(userId, text);
    });
}

function process_message(sender, text) {
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