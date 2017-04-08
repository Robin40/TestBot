const express = require('express');
const router = express.Router();

/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

router.get('/', (req, res) => {
    res.send(req.query['hub.challenge']);
});

module.exports = router;
