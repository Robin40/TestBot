const requestify = require('requestify');
const state = require("./state_machine.js");
const Activity = require("./activity.js");
const login = require("facebook-chat-api");
const User = require("./User.js");

login({email: "freetime.bot@gmail.com", password : "todossomosbruno123"}, (err, api) => {
    if(err) return console.error(err);

    function greet(user)
    {
        api.sendMessage("Hello!",user.ID, () =>
            api.sendMessage("What do you want to do?", user.ID));
    }

    function notifyUsers(userList,name)
    {
        api.sendMessage("Are you ready for ${name}?!",userList, (err, messageInfo) => {
            api.setTitle(`It's ${name} time!`, messageInfo.threadID);
        });
    }

    api.listen((err, message) =>
    {
        let userID = message.senderID;
        let user = User.byID[userID] || new User(userID);
        const last = user.state;
        let next = last;
        let text = message.body;

        if (last === undefined) {
            greet(user);
            next = state.WANT;
        }

        else if (last === state.WANT) {
            const actName = text.toLowerCase();
            user.actName = actName;

            const activity = Activity.byName[actName];
            if (!activity) {
                api.sendMessage(`How many people do you need?`, userID);
                next = state.LIMIT_PLEASE;
            } else {
                activity.addMember(userID);
                api.sendMessage(`OK, I am going to find the people that you need`, userID);
                next = state.WAITING_FOR_PEOPLE;
            }
        }
        else if (last === state.LIMIT_PLEASE) {
            const limit = +text;
            if(limit === 1)
                api.sendMessage(`You can't do ${user.actName} all by yourself!`, userID);
            else if(limit > 10)
                api.sendMessage(`Sorry, too much people! :/`,userID);
            else
            {
                Activity.byName[user.actName] = new Activity(user.actName, limit, notifyUsers);
                Activity.byName[user.actName].addMember(userID);
                api.sendMessage(`OK, I am going to find the people that you need`, userID);

                next = state.WAITING_FOR_PEOPLE;
            }
        }
        else if (last === state.WAITING_FOR_PEOPLE) {
            api.sendMessage(`Wait please, I am searching for people`,userID);
        }

        user.state = next;
        User.byID[userID] = user;

    });
});

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

function greet(user) {
    login({appState: W}, (err, api) => {
        if(err) return console.error(err);

        api.sendMessage(user.ID,"Hola");
    });
}

function process_message(user, text) {
    console.log('user = ', user);
    const last = user.state;
    let next = last;

    //console.log(user, last, next);
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