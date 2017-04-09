const requestify = require('requestify');
const state = require("./state_machine.js");
const Activity = require("./activity.js");

const ACCESS_TOKEN = "EAAbCANkytUYBAOhJ3xmXfcqHwajvWy5uhWUmuI0VxIzIJs8hOTxVbzefm2SFb6uL4ZBYjZCuZCKiSnXLJOCxjPBUWrwtUUwrBalm8dqy36oorFGP4KiJA7iBhE556Q1iENzyesZCuQMPeChyvoMpw8P9leibb5SyignjJqjiSQZDZD";

function send(data) {
    console.log('se ejecuto el send');
    return requestify.post("https://graph.facebook.com/v2.6/me/messages?access_token=" + ACCESS_TOKEN, data)
        .fail(response => {
            console.log(`fallo la mierda po`, response.getCode());
            return Promise.reject(response.getCode());
        });
}

function send_message(user, text) {
    return send({
        recipient: {id: user.ID},
        message: {text: text}
    });
}

function get_data_of(user) {
    return requestify.get(`https://graph.facebook.com/v2.6/${user.ID}? fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${ACCESS_TOKEN}`).then(response => {
        console.log('response');
        return response.getBody();
    }).fail(response => {
        console.log('fail');
        return Promise.reject(response.getCode());
    });
}

function send_picture(user) {
    return get_data_of(user).then(json => {
        const photo = json.profile_pic;
        return send({
            recipient: {id: user.ID},
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

function send_buttons(user) {
    
    return send({
        recipient: {id: user.ID},
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "What do you want to do next?",
                    buttons: [
                        {
                            type: "web_url",
                            url: "http://google.com/",
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

function greet(user) {
    return get_data_of(user).then(userData => {
        const text = `Hi ${userData.first_name}!`;
        return send_message(user, text);
    });
}

function process_message(user, text) {
    const last = user.state;
    let next = last;

    if (last === undefined) {
        greet(user)
            .then(() => send_buttons(user));
        next = state.HELLO;
    }
    else if (last === state.HELLO) {
        send_message(user, 'Please use the buttons')
            .then(() => send_buttons(user));
    }
    else if (last === state.WANT) {
        const actName = text.toLowerCase();
        user.actName = actName;

        const activity = Activity.byName[actName];
        if (!activity) {
            send_message(user, `How many people do you need?`);
            next = state.LIMIT_PLEASE;            
        } else {
            activity.addMember(user);
            send_message(user, `OK, I am going to find the people that you need`);
            next = state.WAITING_FOR_PEOPLE;
        }
    }
    else if (last === state.LIMIT_PLEASE) {
        const limit = +text;
        Activity.byName[user.actName] = new Activity(user.actName, limit);
        send_message(user, `OK, I am going to find the people that you need`);
        next = state.WAITING_FOR_PEOPLE;
    }
    else if (last === state.WAITING_FOR_PEOPLE) {
        send_message(user, `Wait please, I am searching for people`);
    }

    user.state = next;
}

const action = {
    I_WANT: user => {
        send_message(user, 'What do you want?');
        user.state = state.WANT;
    }
}

function process_payload(user, payload) {
    action[payload](user);
}

module.exports = {
    process_message: process_message,
    process_payload: process_payload
};