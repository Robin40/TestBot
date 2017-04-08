/**
 * Created by gabriel on 08-04-17.
 */

var requestify = require('requestify');
'use strict';

class Activity{

    constructor(name,limit){
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

    addMember(username){
        if(users.length<limit){
            users.push(username);
        }
        if(users.length===limit){
            this.notifyUsers(this.users,this.time,this.place);
        }
    }

    getMembers(){
        return this.users;
    }

}

module.exports = Activity;