
const login = require("facebook-chat-api");

login({email: "freetime.bot@gmail.com", password : "todossomosbruno123"}, (err, api) => {
   if(err) return console.error(err);

    let friends = [];

   api.getFriendsList((err, data) =>
   {
       for(friend of data)
       {
           friends.push(friend.userID.toString());
           console.log(friend.userID);
       }

       api.sendMessage("HOLA QUIEREN CULEAR O ALGO",friends);
   });

    api.listen((err,message) =>
    {
        api.sendMessage(message.body,message.threadID);
        console.log(message.threadID);
    });

});

