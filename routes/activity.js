/**
 * Created by gabriel on 08-04-17.
 */

'use strict';

const requestify = require('requestify');
const login = require("facebook-chat-api");

class Activity{

    constructor(name, limit, notifyUsers){
        this.name = name;
        this.limit = limit;
        this.users = [];
        this.time = 0;
        this.place = '';
        this.notifyUsers = notifyUsers;
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
            this.notifyUsers(this.users,this.name);
            Activity.byName[this.name] = undefined;
            for(U in this.users)
            {
                User.byID[U.ID] = undefined;
            }
        }
        console.log(this.users.length);
    }

    getMembers(){
        return this.users;
    }
}

Activity.byName = {};

module.exports = Activity;