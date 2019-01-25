var express = require(`express`);
var app = express();
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');


// APP CONFIG
//app.set('port', 3000);

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json())
app.set('port', process.argv[2]);

app.use(function(req,res,next){
    res.locals.userInput = 0;
    next();
})

// HOME
app.get('/', function(req, res, next){
	res.render('home');
});

// Actions
app.get('/actions', function(req, res, next){
	mysql.pool.query("SELECT * FROM fin_acct", function(err, rows, fields){
	 		if(err) throw err;
	res.render('actions', {context: rows});
	});
});

//Information
app.get('/information', function(req, res, next){
	mysql.pool.query("SELECT * FROM fin_people", function(err, rows, fields){
	 		if(err) throw err;
	res.render('information', {context: rows});
	});
});

//updating information
app.get('/update_info/:user_id', function(req, res){
       mysql.pool.query("SELECT * FROM fin_people", function(err, rows, fields){
	 		if(err) throw err;
	res.render('update_info', {context: rows});
	});
});
app.post('/update_info/:user_id', function(req, res){
	console.log(req.body)
	console.log(req.params.user_id)
	var mysql = req.app.get('mysql');
	var sql = "UPDATE fin_people SET fname =?, lname=?, address=?, age=?, annual_inc=?";
	mysql.pool.query(sql,[req.body.fname, req.body.lname, req.body.address, req.body.age, req.body.annual_inc, req.params.user_id], 
	function(err, results,fields){
		if(err) throw err;
		return res.redirect('/information');
	});
});


// Monthly
app.get('/month', function(req, res, next){
	mysql.pool.query("SELECT * FROM Months", function(err, rows, fields){
	 		if(err) throw err;
	res.render('month', {context: rows});
	});
});

// EDIT Note
app.get('/editNote/:month', function(req, res, next){
	mysql.pool.query("SELECT * FROM Months", function(err, rows, fields){
		if(err) throw err;
		res.render('editNote', { context: rows });
	});
});

// UPDATE Note 
app.post('/updateNote/:month', function(req, res, next){
	mysql.pool.query("UPDATE Months SET note=? WHERE month=' "+req.params.month+" '", 
	[req.body.note], function(err, results){
		if(err) throw err;
		return res.redirect('/month');
	});
});

//Large Purchase
app.get('/largeCalc', function(req, res, next){
	mysql.pool.query("SELECT * FROM Months", function(err, rows, fields){
		if(err) throw err;
		mysql.pool.query("SELECT * FROM fin_people",	function(err, peo, fields){
			if(err) throw err;
			res.render('largeCalc', {context: rows, fin_people: peo});
		});
	});
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//Large Purchase
app.post('/calculate', function(req, res, next){
	var input = {
		noYears : req.body.years,
		noAmount : req.body.amount
	}
	console.log(input);
	mysql.pool.query("SELECT * FROM Months", function(err, rows, fields){
		if(err) throw err;
		mysql.pool.query("SELECT * FROM fin_people",	function(err, peo, fields){
			if(err) throw err;
			res.render('largeCalc', {context: rows, fin_people: peo, userInput: input});
		});
	});
});

//Savings Goal
app.get('/savingsGoal', function(req, res, next){
	mysql.pool.query("SELECT * FROM Months", function(err, rows, fields){
		if(err) throw err;
		mysql.pool.query("SELECT * FROM fin_people",	function(err, peo, fields){
			if(err) throw err;
			res.render('savingsGoal', {context: rows, fin_people: peo});
		});
	});
});

//Savings Goal
app.post('/saveCalc', function(req, res, next){
	var input = {
		noMonths : req.body.monthAmount,
		noAmount : req.body.amount 
	}
	console.log(input);
	mysql.pool.query("SELECT * FROM Months", function(err, rows, fields){
		if(err) throw err;
		mysql.pool.query("SELECT * FROM fin_people",	function(err, peo, fields){
			if(err) throw err;
			res.render('savingsGoal', {context: rows, fin_people: peo, userInput: input});
		});
	});
});


//monthly forecast
app.get('/forecast', function(req, res, next){
	mysql.pool.query("SELECT *, ROUND((LASTMONTH + CURRENTMONTH)/2, 2) AS NEXTMONTH from forecast", 
		function(err, rows, fields){
	 		if(err) throw err;
	res.render('forecast', {context: rows});
	});
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// About
app.get('/about', function(req, res, next){
	res.render('about');
});


app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});



