/**
 * Created by gabriel on 08-04-17.
 */
'use strict';

class Activity{

    constructor(name,limit,notifyUsers){
        this.name = name;
        this.limit = limit;
        this.users = [];
        this.notifyUsers = notifyUsers;
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
        else{
            this.notifyUsers(this.users,this.time,this.place);
        }
    }

    getMembers(){
        return this.users;
    }
}

module.exports = Activity;