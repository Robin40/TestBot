
const login = require("facebook-chat-api");

login({email: "freetime.bot@gmail.com", password : "todossomosbruno123"}, (err, api) => {
   if(err) return console.error(err);

   api.sendMessage("Wena",1076235082);

   api.listen((err, message) => {
       console.log(message.body);
       api.sendMessage(message.body,message.threadID);
   });
});

