/**
 * Created by r-a-c on 08-04-2017.
 */



class User {
    constructor(userID, name)  {
        this.ID = userID;
        this.name = name;
        this.actName = undefined;
        this.state = undefined;
    }

}

User.byID = {};

module.exports = User;
