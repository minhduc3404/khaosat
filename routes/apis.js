var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host            : 'us-cdbr-iron-east-03.cleardb.net',
  	user            : 'b4257536fe169a',
  	password        : '56938c18',
  	database        : 'heroku_d2cd9a76a8f3884'
  },
  pool: { min: 0, max: 7 }
});


//dang ky

/* GET users listing. */
router.post('/bangks', function(req, res, next) {
	var personObj = {
		"name" : "Nguyen Quang Huệ",
		"age" : 25,
		"from" : "Ho Chi Minh",
		"height" : 170
	}

	var student_string = JSON.stringify(personObj);

  	res.send(student_string);
});



router.post('/register',function(req, res,next){
	var _username = req.body.username;
	var _password = req.body.password;
	var _fullname = req.body.fullname;

	if(_username && _password && _fullname)
	{
		knex('account')
		.returning('id')
		.insert({username:_username,password:_password,fullname:_fullname})
		.asCallback(function(err,rows){
			if(!err){
				var result = {
					error:0,
					msg:"Dang ki thanh cong",
					data:[]
				}
				res.send(result);
			}
			else {
				var result = {
					error:1,
					msg:"Tai khoan da ton tai",
					data:[]
				};
				res.send(result);
			}
		});
	}else{
		console.log("du lieu khong hop le");
		var error = {
			error:1,
			data:[],
			msg:"Du lieu khong dung"
		};

		res.send(error);
	}

	
});


//Ham dang nhap
router.post('/login', function(req, res,next){
	var _username = req.body.username;
	var _password = req.body.password;

	if(_username && _password){
		knex('account')
		.where({username:_username, password:_password})
		.select('username')
		.asCallback(function(err,rows){
			if(!err && rows.length >0){

				var result = {
					error:0,
					msg:"Dang nhap thanh cong",
					data:rows[0]
				}
				res.send(result);
			}else{
				var error = {
				error:1,
				data:[],
				msg:"Tai khoan hoac mat khau khong dung"};

				res.send(error);
			}
		});
	}else{
		var error = {
			error:1,
			data:[],
			msg:"Du lieu khong dung"
		};

		res.send(error);
	}
});


//Upload file
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now()+".png")
  }
})

var upload = multer({ storage: storage }).single('avatar');
var upload_multifile = multer({ storage: storage }).array('photo',5);
router.post('/upload', function(req,res,next){
	 upload(req,res,function(err) {
	        if(err) {
	        	var error = {
				error:1,
				data:[],
				msg:"File chua duoc upload"
			};
			res.send(error);
        }else{
        	knex('images')
        	.insert({image:req.file.filename})
        	.asCallback(function(err,rows){
        		if(!err){
        			var result = {
					error:0,
					data:[{path:req.file.filename}],
					msg:"File duoc upload"
					};
					res.send(result);
        		}else{
					var result = {
						error:1,
						data:[],
						msg:"File chua duoc upload"
						};
						res.send(result);
        		}
        	});
	       
        }
    });
});


router.post('/upload_images', function(req,res,next){
	 upload_multifile(req,res,function(err) {
	        if(err) {
	        	var error = {
				error:1,
				data:[],
				msg:"File chua duoc upload"
			};

			console.log(err);
			res.send(error);
        }else{
        	console.log(req.files[0].filename);
        	var paths = [req.files.length];
        	for (var i = 0; i < req.files.length; i++) {
        		paths[i] = {image:req.files[i].filename};
        	}

        	knex('images').insert(paths).asCallback(function(err,rows){
					
						var result = {
							error:0,
							data:paths,
							msg:"File duoc upload"
							};
						res.send(result);
        		});
        	
        }
    });
});


//Get List Store System
router.post('/list_store', function(req, res, next){
	knex('system').select().asCallback(function(err, rows){
		if(!err)
		{
			return res.send({
				error:0,
				msg:"",
				data:rows
			});
		}
	});
});

router.post('/login_no_pass', function(req, res, next){
	var _username = req.body.username;
	if(_username){
		knex('account')
		.where({username:_username})
		.select('username','fullname').asCallback(function(err,rows){
			if(!err && rows.length>0)
			{
				return res.send({
					error:0,
					msg:"",
					data:rows[0]
				});
			}else{
				return res.send({
					error:1,
					msg:"ko the dang nhap",
					data:[]
				});
			}
		});
	}else{
		return res.send({
					error:1,
					msg:"ko the dang nhap",
					data:[]
				});
	}
})

router.post('/list_province', function(req, res, next){
	knex('province').select().asCallback(function(err, rows){
		if(!err){
			res.send({
					error:0,
					msg:"",
					data:rows
				});
		}
		else{
			res.send({
					error:1,
					msg:"Co loi say ra",
					data:[]
				});
		}
	});
});

router.post('/list_district', function(req, res, next){
	var province_id = req.body.province_id;

	knex('district').where({provinceid:province_id}).asCallback(function(err,rows){
		if(!err){
			res.send({
					error:0,
					msg:"",
					data:rows
				});
		}
		else{
			res.send({
					error:1,
					msg:"Co loi say ra",
					data:[]
				});
		}
	});
});


router.post('/list_ward', function(req, res, next){
	var district_id = req.body.district_id;

	knex('ward').where({districtid:district_id}).asCallback(function(err,rows){
		if(!err){
			res.send({
					error:0,
					msg:"",
					data:rows
				});
		}
		else{
			res.send({
					error:1,
					msg:"Co loi say ra",
					data:[]
				});
		}
	});
});

router.post('/area_store', function(req, res, next){
	knex('areastore').columnInfo().then(function (columns) {
		res.send(columns);
	});
});

router.get('/list_image', function(req, res){
	knex('images').select()
	.orderBy('id', 'desc').asCallback(function(err,rows){
		if(!err)
			res.send(rows);
		else
			res.send(err);
	});
});


router.post('/survey', function(req,res,next){

	var data = {
		id:1,
		type:1,
		data:[
			{
				name:'rectangle',
				name_display:'Hinh Chu Nhat'
			},
			{
				name:'circle',
				name_display:'Hinh Tron'
			},
			{
				name:'other',
				name_display:'Khac'
			}
		]
	};

	knex('survey_table')
	.select('id','name','title','type','order')
	.orderBy('order')
	.asCallback(function(err, rows){
		if(!err){
			res.send({
					error:0,
					msg:"",
					data:rows
				});
		}else{
			res.send({
					error:1,
					msg:"Co loi say ra",
					data:[]
				});
		}
	});

	
	/*knex('tablediscribe')
	.select('survey_table.id')
	.join('survey_table',function(){
		this.on(function(){
			this.on('tablediscribe.table_id','=', 'survey_table.id'),
			this.orOn('survey_table.id','=',2);
		});
	})
	.asCallback(function(err,rows){
		if(!err){
			res.send(rows);
		}else{
			res.send(err);
		}
	});*/
});


router.post('/table_attritute', function(req,res,err){
	var _table_id = req.body.table_id;

	knex('tablediscribe')
	.select('name_column','name_display')
	.where({table_id:_table_id})
	.orderBy('position')
	.asCallback(function(err, rows){
		if(!err){
			res.send({
					error:0,
					msg:"",
					data:rows
				});
		}else{
			res.send({
					error:1,
					msg:"Co loi say ra",
					data:[]
				});
		}
	});
});


router.post('/survey_table', function(req, res, err){
	knex('survey_table')
	.select('*')
	.asCallback(function(err, rows){
		if(!=err){
			res.send({data:rows}});
		}
		else{
			res.send({data:null});
		}
	});
});

module.exports = router;
