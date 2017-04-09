/**
 * Created by gabriel on 08-04-17.
 */

'use strict';

const requestify = require('requestify');
const login = require("facebook-chat-api");

class Activity{

    constructor(name, limit){
        this.name = name;
        this.limit = limit;
        this.users = [];
        this.time = 0;
        this.place = '';
    }

    setTime(time){
        this.time = time;
    }

    setPlace(place){
        this.place = place;
    }

    addMember(user){
        if(this.users.length<this.limit && this.users.indexOf(user) === -1){
            this.users.push(user);
        }
        if(this.users.length===this.limit){
            this.notifyUsers();
        }
    }

    getMembers(){
        return this.users;
    }

    notifyUsers() {
        login({email: "freetime.bot@gmail.com", password : "todossomosbruno123"}, (err, api) => {
            if(err) return console.error(err);
            //api.setOptions({force_login: true, selfListen: true});
            let myID = api.getCurrentUserID();

            api.sendMessage("Are you ready for " + this.name + "?!",
                (userList => {
                    console.log('userList ', userList);
                    let ids = userList.map(user => user.ID);
                    ids.push(myID);
                    return ids;
                })(this.users), (err, messageInfo) => {
                api.setTitle(this.name, messageInfo.threadID);
                //Podria ser foto en futuro, podria dar comando para eliminar
            });

        });
    }
}

Activity.byName = {};

module.exports = Activity;