var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host            : 'localhost',
  	user            : 'root',
  	password        : '',
  	database        : 'question'
  },
  pool: { min: 0, max: 7 }
});


//dang ky

/* GET users listing. */
router.post('/survey', function(req, res, next) {
	knex('surveytable').select("*").asCallback(function(err,rows){
		console.log(err);
		res.send(rows);
	});
});

module.exports = router;