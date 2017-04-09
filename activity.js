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

    addMember(userID){
        if(this.users.length<this.limit && this.users.indexOf(userID) === -1){
            this.users.push(userID);
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
            api.setOptions({force_login: true, selfListen: true});
            let ID;
            api.sendMessage("Are you ready for " + this.name + "?!", this.users, (err, messageInfo) => {
                ID = messageInfo.threadID;
                api.setTitle(this.name, threadID);
                //Podria ser foto en futuro, podria dar comando para eliminar
            });

        });
    }
}

module.exports = Activity;