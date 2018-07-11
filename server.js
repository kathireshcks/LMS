const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./router');
const mysql = require('mysql'); 
const User = require('./user.js');
const merge = require('merge');
const mysqlstore = require('express-mysql-session')(session);
const bcrypt = require('bcryptjs');
const date = require('date-and-time');
var flash = require('connect-flash');
var json2xls=require('json2xls');



var server = {
	host:'127.0.0.1',
	user:'kathir',
	password:'12439361@k'};

var con = mysql.createConnection(server);
con.connect(function(err){
		if(err) throw err;
		else{
			console.log("MySQL Server connected");
		}
	});
var db = "CREATE DATABASE IF NOT EXISTS newdata";
	con.query(db,function(err,result){
		if(err) throw err;
		else{
				if(result.warningCount == 0){
					console.log("Database Not Exits, Created");
					}
				else{
						console.log("Database Already Exists");
					}
					//con.end();
						var table = "CREATE TABLE IF NOT EXISTS users (id VARCHAR(20),staffidid VARCHAR(100),name VARCHAR(100), username VARCHAR(100), password VARCHAR(100),mobilenumber VARCHAR(100),desi VARCHAR(100),dept VARCHAR(100),gender VARCHAR(100),dob VARCHAR(100),casualavail FLOAT,vacationavail FLOAT,ondutyavail FLOAT,permissionavail INT(100),casual FLOAT,vacation FLOAT,onduty FLOAT,permission INT(100),llb INT(100),Compensation INT(100),forget VARCHAR(100),leavelayer VARCHAR(100),permissionlayer VARCHAR(100))";
						var table1 = "CREATE TABLE IF NOT EXISTS permission (_id VARCHAR(20),name VARCHAR(100),date DATE, time VARCHAR(100), desi VARCHAR(100),staffid VARCHAR(100),dept VARCHAR(100),hod VARCHAR(100),principal VARCHAR(100),co VARCHAR(100),ao VARCHAR(100),uuid VARCHAR(100),appliedtime VARCHAR(100),cancel VARCHAR(100))";
						var table2 = "CREATE TABLE IF NOT EXISTS leavesecond (date VARCHAR(20),period VARCHAR(100),classs VARCHAR(100),sub VARCHAR(100), staffid VARCHAR(100),alteruid VARCHAR(100),_id VARCHAR(100),desi VARCHAR(100),dept VARCHAR(100),alterstaffid VARCHAR(100),appliedtime VARCHAR(100),uuid VARCHAR(100),alterid VARCHAR(100),status VARCHAR(100),name VARCHAR(100))";
						var table3 = "CREATE TABLE IF NOT EXISTS applyleave (_id VARCHAR(20),name VARCHAR(100),type VARCHAR(100),fromdate DATE, todate DATE,frommy VARCHAR(100),tomy VARCHAR(100),fromtime VARCHAR(100),totime VARCHAR(100),purpose VARCHAR(100),desi VARCHAR(100),staffid VARCHAR(100),dept VARCHAR(100),hod VARCHAR(100),principal VARCHAR(100),co VARCHAR(100),ao VARCHAR(100),uuid VARCHAR(100),appliedtime VARCHAR(100),numberofdays FLOAT,cancel VARCHAR(100))";
						var table4 = "CREATE TABLE IF NOT EXISTS extra (cc VARCHAR(20),sub1 VARCHAR(20),sub2 VARCHAR(20),sub3 VARCHAR(20),sub4 VARCHAR(20),sub5 VARCHAR(20),sub6 VARCHAR(20),sub7 VARCHAR(20),sub8 VARCHAR(20))";
						var table5 = "CREATE TABLE IF NOT EXISTS compensation (id VARCHAR(20),name VARCHAR(100),dept VARCHAR(100),desi VARCHAR(100),date DATE,hod VARCHAR(100),principal VARCHAR(100),co VARCHAR(100),ao VARCHAR(100),uuid VARCHAR(100),cancel VARCHAR(100),usethis VARCHAR(100))";
						var server2 = server;
						server2.database = 'newdata';
						var con2 = mysql.createConnection(server);
						User.serverd(server2);
						con2.connect(function(err){
							if(err) throw err;
							else{
									con2.query(table,function(err,result){
										if(err) throw err;
										else{
												if(result.warningCount == 0){
													var pass = "lmsadmin123";
													bcrypt.hash(pass,10,function(err,hash){
														if(err) throw err;
														pass=hash;
														var idn=date.format(new Date(), 'YYYYMMDDHHmmss');
														idn = parseInt(idn);
													
														var ins = "INSERT INTO users (id,username,password,mobilenumber,name,desi) VALUES ('"+idn+"','lmsadmin@tnce.in','"+pass+"','8940416323','Admin','Admin')";
															con2.query(ins,function(err,result){
																if(err) throw err;
																else{
																	console.log("admin created")
																}
															});
															console.log("Table user Not Exits, Created");
													});
												}
												
												else{
														console.log("Table user Already Exists");
													}
										}
									});

									con2.query(table1,function(err,result){
										if(err) throw err;
										else{
												if(result.warningCount == 0){
													console.log("Table1 user Not Exits, Created");
													}
												else{
														console.log("Table1 user Already Exists");
													}
											}
									});

									con2.query(table2,function(err,result){
										if(err) throw err;
										else{
												if(result.warningCount == 0){
													console.log("Table2 user Not Exits, Created");
													}
												else{
														console.log("Table2 user Already Exists");
													}
											}
									});

									con2.query(table3,function(err,result){
										if(err) throw err;
										else{
												if(result.warningCount == 0){
													console.log("Table3 user Not Exits, Created");
													}
												else{
														console.log("Table3 user Already Exists");
													}
											}
									});

									con2.query(table4,function(err,result){
										if(err) throw err;
										else{
												if(result.warningCount == 0){
													console.log("Table4 user Not Exits, Created");
													}
												else{
														console.log("Table4 user Already Exists");
													}
											}
									});

									con2.query(table5,function(err,result){
										if(err) throw err;
										else{
												if(result.warningCount == 0){
													console.log("Table5 user Not Exits, Created");
													}
												else{
														console.log("Table5 user Already Exists");
													}
											}
									});
							}
						});
			}
		});

app.use(express.static(__dirname + '/'));

var sessiontable = {
	database: 'newdata',
	createDatabaseTable: true,
	schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionDb = merge(server,sessiontable);

app.use(session({
	secret:"newdata",
	resave:true,
	saveUninitialized:false,
	store:new mysqlstore(sessionDb)
}));

app.use(bodyParser.json());
app.use(flash());
app.use(json2xls.middleware);
app.use(bodyParser.urlencoded({extended:false}));

app.use('/',routes);
app.use(function(req,res,next){
	return next(req);
});
app.use(function(err,req,res,next){
	//console.log("function");
});

	
	
app.listen(8000,function(){console.log('Listening at port 8000');});