const express=require('express');
const router=express.Router();
const path=require('path');
const User = require('./user.js');
const mysql = require('mysql');
var Promise = require('promise');
const date = require('date-and-time'); 
const alert =require('alert-node');
var moment = require('moment');
var schedule = require('node-schedule');
var flash = require('connect-flash');
var async = require("async");
var fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
var json2xls=require('json2xls');
var dateFormat = require('dateformat');
const delay = require('delay');

router.get('/',function(req,res,next){
	console.log("start function");
	if(req.session.userId == undefined || req.session.desi==undefined){
		res.sendFile(path.join(__dirname + '/login1.html'));
		return next(req);
	}
	else if(req.session.desi=="professor"){
		return res.redirect('/home');
		
	}
	else if(req.session.desi=="hod"||req.session.desi=="principal"){
		return res.redirect('/hod');
		
	}
	else if(req.session.desi=="office"){
		return res.redirect('/office');
		
	}
	else if(req.session.desi=="co"){
		return res.redirect('/co');
		
	}else if(req.session.desi=="Admin"){
		return res.redirect('/admin');
	}
	else if(req.session.desi=="ao"){
			return res.redirect('/hod');
			
	}else {
		return res.redirect('/home');
		
	}
});

router.get('/home',function(req,res){
	console.log("Session Id : "+req.session.userId);
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
	User.find("id",req.session.userId,function(result){
		if(result[0] == null){
				res.send("You are not Authorized");
			}
			else{
				//if(req.session.desi=="professor"){
				res.sendFile(path.join(__dirname + '/main.html'));
				//}
				
				
			}
	});
	}
});

router.get('/forget',function(req,res){
	
				res.sendFile(path.join(__dirname + '/forgetpassword.html'));
				
				
	
});

router.post('/forget2',function(req,res){
	User.find("username",req.body.email,function(result){
		if(result[0] == null){
			res.send("No Account");
		}
		else{
			var otp=Math.floor(Math.random()*1000)+1000;
			console.log(otp);

			User.update("users","forget",otp,"username",req.body.email,function(update){
				console.log(update);
				User.sendMail(result[0].id,"OTP","OTP is :"+otp,function(dd){
					console.log(dd);
				});
				
			});  
			req.session.username=req.body.email;
			res.sendFile(path.join(__dirname + '/forgototp.html'));
			
			
			
		}				
				
			
	});
	
});

router.post('/forgetchange',function(req,res){
	console.log(req.session.username);
	console.log(req.body.otp);
	User.find("username",req.session.username,function(result){
				console.log(result);
				console.log(result[0].forget);
			if(result[0].forget==req.body.otp){
			
				res.sendFile(path.join(__dirname + '/forgetfinal.html'));
			}
			else{
				res.send("otp wrong");
			}
		});		
				
			
	
});

router.post('/forgetfinal',function(req,res){
	
	if(req.body.pass1==req.body.pass2){
		User.find("username",req.session.username,function(result){
			if(req.body.pass1){
				//var pass = req.body.pass1;
				console.log(req.body.pass1);
				var password=req.body.pass1;
						User.encrypt(password,function(err,pass){
							console.log(pass);
							User.update("users","password",pass,"username",req.session.username,function(err,result){
								console.log("enter back update");
								req.session.username="null";
								return res.redirect('/');
						
							});
						});
			}
		});		
	}	
	else{
		res.send("Enter correct password");
	}	
			
	
});

router.get('/hod',function(req,res){
	console.log("Session Id : "+req.session.userId);
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
	User.find("id",req.session.userId,function(result){
		if(result[0] == null){
				res.send("You are not Authorized");
			}
			else{
				//res.send('Welcome '+result[0].username);
				res.sendFile(path.join(__dirname + '/hod.html'));
			}
	});
	}
});

router.get('/princ',function(req,res){
	console.log("Session Id : "+req.session.userId);
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
	User.find("id",req.session.userId,function(result){
		if(result[0] == null){
				res.send("You are not Authorized");
			}
			else{
				//res.send('Welcome '+result[0].username);
				res.sendFile(path.join(__dirname + '/hod.html'));
			}
	});
	}
});

router.get('/co',function(req,res){
	console.log("Session Id : "+req.session.userId);
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
	User.find("id",req.session.userId,function(result){
		if(result[0] == null){
				res.send("You are not Authorized");
			}
			else{
				//res.send('Welcome '+result[0].username);
				res.sendFile(path.join(__dirname + '/co.html'));
			}
	});
	}
});
router.get('/office',function(req,res){
	console.log("Session Id : "+req.session.userId);
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
	User.find("id",req.session.userId,function(result){
		if(result[0] == null){
				res.send("You are not Authorized");
			}
			else{
				//res.send('Welcome '+result[0].username);
				res.sendFile(path.join(__dirname + '/officemain.html'));
			}
	});
	}
});

router.get('/ld',function(req,res,next){
	console.log("enter id");
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		User.finda("users","id",req.session.userId,function(result){
			if(result[0] == null){
					res.send("You are not Authorized");
				}
				else{
					console.log(result);
					var ldjson = '{"casual":"'+result[0].casual+'","vacation":"'+result[0].vacation+'","onduty":"'+result[0].onduty+'","permission":"'+result[0].permission+'","casualavail":"'+result[0].casualavail+'","vacationavail":"'+result[0].vacationavail+'","ondutyavail":"'+result[0].ondutyavail+'","permissionavail":"'+result[0].permissionavail+'"}';
					console.log(ldjson);
					res.send(result);
				}
		});
	}
});



router.get('/notification',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		res.sendFile(path.join(__dirname + '/notification.html'));
		return next(req);
	}
});

router.get('/extradata',function(req,res,next){
	
	if(req.session.userId == undefined || req.session.desi != "Admin"){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		res.sendFile(path.join(__dirname + '/data.html'));
		return next(req);
	}
});


router.get('/getclass',function(req,res,next){
	
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		User.findall("extra",function(result){
			//console.log(result[0]);
				//else{
					//console.log(result);
					res.send(result);
				//}
		});
	}
});

router.post('/addclass',function(req,res,next){
	
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		User.insertclass("extra",req.body.clas,req.body.sub1,req.body.sub2,req.body.sub3,req.body.sub4,req.body.sub5,req.body.sub6,req.body.sub7,req.body.sub8,function(result){
			//console.log(result[0]);
				//else{
					//console.log(result);
					res.sendFile(path.join(__dirname + '/data.html'));
				//}
		});
	}
});

router.get('/reportdateget',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		if(req.session.desi=="Admin"||req.session.dept=="all"){
			res.sendFile(path.join(__dirname + '/reportall.html'));
		}else
		res.sendFile(path.join(__dirname + '/reportdate.html'));
		return next(req);
	}
});

router.get('/alterinfo/:nnn',function(req,res){
	//var nn=req.params.nnn;
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("_______________");
		//console.log(nn);
		var msg=req.params.nnn;
		req.flash("alter",msg);
		
		console.log("enter alterinfo");
		res.sendFile(path.join(__dirname + '/applieddetails.html'));
		
	}
});


router.get('/alterdetails',function(req,res,next){
	console.log("enter id");
	var nn=req.flash('alter');
	
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		User.finda("leavesecond","uuid",nn[0],function(result){
			console.log(result[0]);
				//else{
					//console.log(result);
					res.send(result);
				//}
		});
	}
});


router.get('/notificationnew',function(req,res,next){
	console.log("enter notifi");
	console.log("desi is -----"+req.session.desi);
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		if(req.session.desi=="hod"){
			console.log("enter hod");
			/*User.findmultiple("applyleave","hod","Pending","dept",req.session.dept,function(result){
				async.forEachSeries(result,function(key,next){
					if(key.desi=="ae"&&key.dept==req.session.dept){
						
						User.leavesecond("leavesecond","uuid",key.uuid,function(op1,op2,op3){
							console.log(op1);
							console.log(op2);
							console.log(op3);
							//console.log("array  :"+array);
							var array1="null";
							if(op1=="canceled"){
								array1="Canceled";
							}else if(op2=="pending"){
								array1="Pending";
							}else if(op3=="approved"){
								array1="Approved";
							}
							User.update("applyleave",req.session.desi,"Approved","uuid",nn,function(err,result){
								console.log("approved");
								User.sendMail(req.session.userId,"Alert","your leave approved",function(dd){
									console.log(dd);
								});
								
								return res.redirect('/notification');
							
									
					});
						});
						
					}
				});
			});

*/
			User.findmultiple("applyleave","hod","Pending","dept",req.session.dept,function(result){
				console.log(result.length);
					var final=[];
					console.log(result);
					for(var i=0;i<result.length;i++){
					//async.forEachSeries(result,function(key,next){
						//console.log(result);
						//console.log("____________________");
						//console.log("k");
						var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
						result[i].fromdate= date1.format('DD-MM-YYYY');
						var date2 = moment(result[i].todate, 'DD/MM/YYYY');
						result[i].todate= date2.format('DD-MM-YYYY');
						
						if(result[i].desi !="hod" && result[i].dept==req.session.dept){
							final.push(result[i]);	
						}
						
					//});		
					}
					res.send(final);
				
			});
		}
		if(req.session.desi=="principal"){

			User.finda("applyleave","principal","Pending",function(result){
				if(result[0] == null){
					res.send("You are not Authorized");
				}
				else{
					var final=[];
					for(var i=0;i<result.length;i++){
						//console.log(result);
						var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
						result[i].fromdate= date1.format('DD-MM-YYYY');
						var date2 = moment(result[i].todate, 'DD/MM/YYYY');
						result[i].todate= date2.format('DD-MM-YYYY');
				
						//if(result[i].desi=="ae"||result[i].desi=="hod"){
							final.push(result[i]);
						//}
							
					}
					res.send(final);
				}
			});

		}
		if(req.session.desi=="ao"){

			User.finda("applyleave","ao","Pending",function(result){
				if(result[0] == null){
					res.send("You are not Authorized");
				}
				else{
					var final=[];
					for(var i=0;i<result.length;i++){
						//console.log(result);
						var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
						result[i].fromdate= date1.format('DD-MM-YYYY');
						var date2 = moment(result[i].todate, 'DD/MM/YYYY');
						result[i].todate= date2.format('DD-MM-YYYY');
				
						//if(result[i].desi=="ae"||result[i].desi=="hod"){
							final.push(result[i]);
						//}
							
					}
					res.send(final);
				}
			});

		}

		if(req.session.desi=="co"){
			console.log("enter co");
			User.finda("applyleave","co","Pending",function(result){
				if(result[0] == null){
					res.send("You are not Authorized");
				}
				else{
				
					console.log(result);
					console.log(result.length);
					for(var i=0;i<result.length;i++){
						//console.log(result);
						var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
						result[i].fromdate= date1.format('DD-MM-YYYY');
						var date2 = moment(result[i].todate, 'DD/MM/YYYY');
						result[i].todate= date2.format('DD-MM-YYYY');
				
							
					}
					// var ldjson = '{"casual":"'+result[0].casual+'","vacation":"'+result[0].vacation+'","onduty":"'+result[0].onduty+'","permission":"'+result[0].permission+'","casualavail":"'+result[0].casualavail+'","vacationavail":"'+result[0].vacationavail+'","ondutyavail":"'+result[0].ondutyavail+'","permissionavail":"'+result[0].permissionavail+'"}';
					// console.log(ldjson);
				 	res.send(result);
				}
			});

		}
	}
});


router.get('/notificationleave',function(req,res,next){
	console.log("enter notifi");
	console.log("desi is -----"+req.session.desi);
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		if(req.session.desi=="hod"){
			console.log("enter hod");
			/*User.findmultiple("applyleave","hod","Pending","dept",req.session.dept,function(result){
				async.forEachSeries(result,function(key,next){
					if(key.desi=="ae"&&key.dept==req.session.dept){
						
						User.leavesecond("leavesecond","uuid",key.uuid,function(op1,op2,op3){
							console.log(op1);
							console.log(op2);
							console.log(op3);
							//console.log("array  :"+array);
							var array1="null";
							if(op1=="canceled"){
								array1="Canceled";
							}else if(op2=="pending"){
								array1="Pending";
							}else if(op3=="approved"){
								array1="Approved";
							}
							User.update("applyleave",req.session.desi,"Approved","uuid",nn,function(err,result){
								console.log("approved");
								User.sendMail(req.session.userId,"Alert","your leave approved",function(dd){
									console.log(dd);
								});
								
								return res.redirect('/notification');
							
									
					});
						});
						
					}
				});
			});

*/
			User.findmultiple("applyleave","hod","Approved","dept",req.session.dept,function(result){
				console.log(result.length);
					var final=[];
					console.log(result);
					for(var i=0;i<result.length;i++){
					//async.forEachSeries(result,function(key,next){
						//console.log(result);
						//console.log("____________________");
						//console.log("k");
						var now=new Date();
						var date3 = moment(now, 'DD/MM/YYYY');
						now= date3.format('DD-MM-YYYY');
						
						var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
						result[i].fromdate= date1.format('DD-MM-YYYY');
						var date2 = moment(result[i].todate, 'DD/MM/YYYY');
						result[i].todate= date2.format('DD-MM-YYYY');
						
						if(result[i].desi !="hod" && result[i].dept==req.session.dept){
							if(now<result[i].fromdate){
								final.push(result[i]);	
							}
						}	
						
					//});		
					}
					res.send(final);
				
			});
		}
		if(req.session.desi=="principal"){

			User.finda("applyleave","principal","Approved",function(result){
				if(result[0] == null){
					res.send("You are not Authorized");
				}
				else{
					var final=[];
					for(var i=0;i<result.length;i++){
						//console.log(result);
						var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
						result[i].fromdate= date1.format('DD-MM-YYYY');
						var date2 = moment(result[i].todate, 'DD/MM/YYYY');
						result[i].todate= date2.format('DD-MM-YYYY');
						
						var now=new Date();
						var date3 = moment(now, 'DD/MM/YYYY');
						now= date3.format('DD-MM-YYYY');
						//if(result[i].desi=="ae"||result[i].desi=="hod"){
							if(now<result[i].fromdate){
								final.push(result[i]);
							}
							
					}
					res.send(final);
				}
			});

		}
		if(req.session.desi=="ao"){

			User.finda("applyleave","ao","Approved",function(result){
				if(result[0] == null){
					res.send("You are not Authorized");
				}
				else{
					var final=[];
					for(var i=0;i<result.length;i++){
						//console.log(result);
						var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
						result[i].fromdate= date1.format('DD-MM-YYYY');
						var date2 = moment(result[i].todate, 'DD/MM/YYYY');
						result[i].todate= date2.format('DD-MM-YYYY');
						
						var now=new Date();
						var date3 = moment(now, 'DD/MM/YYYY');
						now= date3.format('DD-MM-YYYY');
						//if(result[i].desi=="ae"||result[i].desi=="hod"){
							if(now<result[i].fromdate){
								final.push(result[i]);
							}
							
					}
					res.send(final);
				}
			});

		}

		if(req.session.desi=="co"){
			console.log("enter co");
			User.finda("applyleave","co","Approved",function(result){
				if(result[0] == null){
					res.send("You are not Authorized");
				}
				else{
				
					var final=[];
					for(var i=0;i<result.length;i++){
						//console.log(result);
						var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
						result[i].fromdate= date1.format('DD-MM-YYYY');
						var date2 = moment(result[i].todate, 'DD/MM/YYYY');
						result[i].todate= date2.format('DD-MM-YYYY');
				
						var now=new Date();
						var date3 = moment(now, 'DD/MM/YYYY');
						now= date3.format('DD-MM-YYYY');
						if(now<result[i].fromdate){
							final.push(result[i]);
						}
					}
					// var ldjson = '{"casual":"'+result[0].casual+'","vacation":"'+result[0].vacation+'","onduty":"'+result[0].onduty+'","permission":"'+result[0].permission+'","casualavail":"'+result[0].casualavail+'","vacationavail":"'+result[0].vacationavail+'","ondutyavail":"'+result[0].ondutyavail+'","permissionavail":"'+result[0].permissionavail+'"}';
					// console.log(ldjson);
				 	res.send(result);
				}
			});

		}
	}
});



router.get('/notificationpermission',function(req,res,next){
	console.log("enter notifi per");
	console.log("desi is -----"+req.session.desi);
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		if(req.session.desi=="hod"){
			console.log("enter hod");
			User.findmultiple("permission","hod","Pending","dept",req.session.dept,function(result){
			//User.finda("permission","hod","Pending",function(result){
				console.log(result);
				
				var final=[];
					for(var i=0;i<result.length;i++){
						//console.log(result);
						var date = moment(result[i].date, 'DD/MM/YYYY');
						result[i].date= date.format('DD-MM-YYYY');
				
						//if(result[i].desi !="hod" &&result[i].dept==req.session.dept){
							final.push(result[i]);
						//}
							
					}
					res.send(final);
				
			});
		}
		if(req.session.desi=="principal"){

			User.finda("permission","principal","Pending",function(result){
				if(result[0] == null){
					res.send("You are not Authorized");
				}
				else{
					var final=[];
					for(var i=0;i<result.length;i++){
						//console.log(result);
						var date = moment(result[i].date, 'DD/MM/YYYY');
						result[i].date= date.format('DD-MM-YYYY');
				
						//if(result[i].desi=="ae"||result[i].desi=="hod"){
							final.push(result[i]);
					//	}
							
					}
					res.send(final);
				}
			});

		}
		if(req.session.desi=="ao"){

			User.finda("permission","ao","Pending",function(result){
				if(result[0] == null){
					res.send("You are not Authorized");
				}
				else{
					var final=[];
					for(var i=0;i<result.length;i++){
						//console.log(result);
						var date = moment(result[i].date, 'DD/MM/YYYY');
						result[i].date= date.format('DD-MM-YYYY');
				
						//if(result[i].desi=="ae"||result[i].desi=="hod"){
							final.push(result[i]);
					//	}
							
					}
					res.send(final);
				}
			});

		}
		if(req.session.desi=="co"){
			console.log("enter co");
			User.finda("permission","co","Pending",function(result){
				if(result[0] == null){
					res.send("You are not Authorized");
				}
				else{
					console.log(result);
					for(var i=0;i<result.length;i++){
						//console.log(result);
						var date = moment(result[i].date, 'DD/MM/YYYY');
						result[i].date= date.format('DD-MM-YYYY');
				
							
					}
					/*for(var i=0;i<i<result.length;i++){
						console.log(result[i].date);
					var date = moment(result[i].date, 'DD/MM/YYYY');

					result[i].date= date.format('DD-MM-YYYY');
					}*/
					// var ldjson = '{"casual":"'+result[0].casual+'","vacation":"'+result[0].vacation+'","onduty":"'+result[0].onduty+'","permission":"'+result[0].permission+'","casualavail":"'+result[0].casualavail+'","vacationavail":"'+result[0].vacationavail+'","ondutyavail":"'+result[0].ondutyavail+'","permissionavail":"'+result[0].permissionavail+'"}';
					// console.log(ldjson);
				 	res.send(result);
				}
			});

		}
	}
});


router.get('/appliedper',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		/*if(req.session.desi=="hod"){

			res.sendFile(path.join(__dirname + '/hodappliedpermission.html'));
			return next(req);
		}
		else if(req.session.desi=="principal"){
			res.sendFile(path.join(__dirname + '/principalappliedpermission.html'));
			return next(req);
		}
		else if(req.session.desi=="office"){
			res.sendFile(path.join(__dirname + '/officeappliedpermission.html'));
			return next(req);
		}
		else{*/
			res.sendFile(path.join(__dirname + '/appliedpermissionnew.html'));
			return next(req);
		//}
	}
});

router.get('/appliedlve',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log("enter else"+req.body.desi);
		/*if(req.session.desi=="hod"){
			res.sendFile(path.join(__dirname + '/hodappliedleave.html'));
			return next(req);
		}
		else if(req.session.desi=="principal"){
			res.sendFile(path.join(__dirname + '/principalappliedleave.html'));
			return next(req);
		}
		else if(req.session.desi=="office"){
			res.sendFile(path.join(__dirname + '/officeappliedleave.html'));
			return next(req);
		}
		else{*/
			res.sendFile(path.join(__dirname + '/appliedleavenew.html'));
			return next(req);
		//}
	}
	
});

router.get('/users',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log("enter users");
			res.sendFile(path.join(__dirname + '/userdetails.html'));
			return next(req);
		
	}
	
});

router.get('/leave',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log("enter users");
			res.sendFile(path.join(__dirname + '/leavedetails.html'));
			return next(req);
		
	}
	
});

router.get('/userdetails',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log("enter userdetails");
		User.findall("users",function(result){
			console.log(result);
			if(result.length<0){
					res.send("You are not Authorized");
			}
			else{
				var final=[];
				for(var i=0;i<result.length;i++){
				if(result[i].name !="Admin"){
					final.push(result[i]);
				}
			}
				res.send(final);
				return next(req);
			}
		});
	}
});

router.get('/leavedetail',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log("enter userdetails");
		User.findall("users",function(result){
			if(result.length<0){
					res.send("You are not Authorized");
			}
			else{
				res.send(result);
				return next(req);
			}
		});
	}
});

router.post('/getsubject',function(req,res,next){
		console.log("enter get subject");
		console.log(req.body);
		User.finda("extra","cc",req.body.clas,function(result){
				res.send(result);
				return next(req);
			
		});
	
});

router.get('/finduser',function(req,res,next){
	User.find("id",req.session.userId,function(result){
			res.send(result);
			return next(req);
		
	});

});

router.get('/alteracceptance',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		res.sendFile(path.join(__dirname + '/alteracceptancenew.html'));
		return next(req);
	}
});

router.get('/alteracceptancenew',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		User.find("id",req.session.userId,function(resultu){
			if(resultu[0] == null){
					res.send("You are not Authorized");
			}
			else{
				var staffid=resultu[0].staffidid;	
				User.findmultiple("leavesecond","alterstaffid",staffid,"status","Pending",function(result){
					if(result[0] == null){
						res.send("You are not Authorized");
					}
					else{
						console.log(result);
						res.send(result);
					}
				});
			}
		});
	}
});

router.get('/alteracceptancenew2',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		User.find("id",req.session.userId,function(resultu){
			if(resultu[0] == null){
					res.send("You are not Authorized");
			}
			else{
				var staffid=resultu[0].staffidid;	
				User.finda("leavesecond","alterstaffid",staffid,function(result){
					if(result[0] == null){
						res.send("You are not Authorized");
					}
					else{
						
						var final=[];
						for(var i=0;i<result.length;i++){
							if(result[i].status!="Pending"){
								var f=new Date();
								var date1=new Date(f.setDate(f.getDate() - 2));
								var date2=new Date(result[i].date);
									if(date1<date2){
										final.push(result[i]);
									}
							}
						}
						res.send(final);
					}
				});
			}
		});
	}
});

router.get('/appliedpermission',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
	User.finda("permission","_id",req.session.userId,function(result){
		if(result[0] == null){
				res.send("You are not Authorized");
			}
			else{
				var final=[];

				console.log("++++++++++++++++++++");
				console.log(result);
				for(var i=0;i<result.length;i++){
					var now=new Date();
					console.log("========================");
					console.log(now);
					console.log(result[i].date);
					var date1 = moment(now, 'DD/MM/YYYY');
							now= date1.format('DD-MM-YYYY');
					
					var date = moment(result[i].date, 'DD/MM/YYYY');
							result[i].date= date.format('DD-MM-YYYY');
					
					if(now <= result[i].date ){
						/*console.log("fshgshgfskhdgf,kh"+result[i].date);
						var date = moment(result[i].date, 'DD/MM/YYYY');
							result[i].date= date.format('DD-MM-YYYY');
					
							final.push(result[i]);*/
						if(now<=result[i].date){
							var date = moment(result[i].date, 'DD/MM/YYYY');
							result[i].date= date.format('DD-MM-YYYY');
					
							final.push(result[i]);
						}
						else if(now==result[i].date && now.getHours()<9 && now.getMinutes()>0 && result[i].time=="mor"){
							var date = moment(result[i].date, 'DD/MM/YYYY');
							result[i].date= date.format('DD-MM-YYYY');
					
							final.push(result[i]);
						}
						else if(now==result[i].date && now.getHours()<13 && now.getMinutes()>30 && result[i].time=="afn"){
							var date = moment(result[i].date, 'DD/MM/YYYY');
							result[i].date= date.format('DD-MM-YYYY');
					
							final.push(result[i]);
						}
					}
					
				}
				console.log(final);
				res.send(final);
			}
	});
	}
});

router.get('/appliedleave',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
	User.finda("applyleave","_id",req.session.userId,function(result){
		if(result[0] == null){
				res.send("You are not Authorized");
			}
			else{
				var final=[];
				console.log(result);
				
				for(var i=0;i<result.length;i++){
					var current=new Date();
					var from = moment(result[i].fromdate, 'DD/MM/YYYY');
						var to = moment(result[i].todate, 'DD/MM/YYYY');
						var cu = moment(current, 'DD/MM/YYYY');
						
						result[i].fromdate= from.format('DD-MM-YYYY');
						result[i].todate= to.format('DD-MM-YYYY');
						now=cu.format('DD-MM-YYYY');
					if(result[i].type !="Compensation"){
						if(now <= result[i].fromdate){
							if(now<result[i].fromdate){
								var from = moment(result[i].fromdate, 'DD/MM/YYYY');
							var to = moment(result[i].todate, 'DD/MM/YYYY');
							result[i].fromdate= from.format('DD-MM-YYYY');
							result[i].todate= to.format('DD-MM-YYYY');
						
								final.push(result[i]);
							}
							else if(current.getHours()<9 && current.getMinutes()>0){
								var from = moment(result[i].fromdate, 'DD/MM/YYYY');
							var to = moment(result[i].todate, 'DD/MM/YYYY');
							result[i].fromdate= from.format('DD-MM-YYYY');
							result[i].todate= to.format('DD-MM-YYYY');
						
								final.push(result[i]);
							}
						}
					}else{
						var f=result[i].fromdate;
						console.log(f);
						f=new Date(f);
						f = new Date(f.setDate(f.getDate() + 10));
						var com = moment(f, 'DD/MM/YYYY');
						comdate= com.format('DD-MM-YYYY');
						if(now<=comdate){
							final.push(result[i]);
						}
					}
					
				}
				console.log(final);
				res.send(final);
			} 
			return next(req);
	});
	}
});

router.get('/profilenew',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
	User.find("id",req.session.userId,function(result){
		if(result[0] == null){
				res.send("You are not Authorized");
			}
			else{
				console.log(result);
				 res.send(result);
			}
	});
	}
});

router.post('/applycompensation',function(req,res,next){

	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		var count=Object.keys(req.body).length;
		console.log(count);
		
	User.find("id",req.session.userId,function(result){
		console.log(result);
		if(result[0] == null){
				res.send("You are not Authorized");
			}
			else{
				console.log("enter before");
				for(var i=1;i<=count;i++){
					
					var uuid=date.format(new Date(), 'YYYYMMDDHHmmss');
				uuid = parseInt(uuid);
				uuid=uuid+i;
				//delay(200);
					User.applycompensation(result[0].id,result[0].name,result[0].dept,result[0].desi,req.body['date'+i],uuid,function(err,result){
							
					});
				//	console.log(result[0]);
					/*var compensation=count+result[0].Compensation;
					User.update("users","compensation",compensation,"id",result[0].id,function(output){
						console.log(output);
					});*/
					
				}
				return res.redirect('/');
						
				//res.send(result);
			}
	});
	}
});

router.get('/notificationcompensation',function(req,res,next){

	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//var count=Object.keys(req.body).length;
		
	User.finda("compensation",req.session.desi,"pending",function(result){
		console.log(result);
		res.send(result);
		

	});
	}
});

router.get('/compensationsingle',function(req,res,next){

	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//var count=Object.keys(req.body).length;
		
	User.finda("compensation","id",req.session.userId,function(result){
		var current=new Date();
		var cu = moment(current, 'DD/MM/YYYY');
		
		now=cu.format('DD-MM-YYYY');
	var final=[];
		for(var i=0;i<result.length;i++){
			var f=result[i].date;
						//console.log(f);
						
						f=new Date(f);
						f = new Date(f.setDate(f.getDate() + 10));
						var com = moment(f, 'DD/MM/YYYY');
						comdate= com.format('DD-MM-YYYY');
						console.log("before"+result[i].date);
						result[i].date=comdate;

						console.log("now"+comdate);
						console.log(now);
						if(now<=comdate){
							final.push(result[i]);
						}
			//var cu = moment(result[i].date, 'DD/MM/YYYY');			
			//result[i].date= cu.format('DD-MM-YYYY');
		}
		console.log(final);
		res.send(final);
		

	});
	}
});


router.get('/retrivecompensationnotuse',function(req,res,next){

	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//var count=Object.keys(req.body).length;
		
	User.finda("compensation","id",req.session.userId,function(result){
		
	var final=[];
	console.log(result);
		for(var i=0;i<result.length;i++){
						if(result[i].usethis=="notused"){
							if(result[i].hod=="Approved"||result[i].hod=="-"){
								if(result[i].principal=="Approved"||result[i].principal=="-"){
									if(result[i].co=="Approved"||result[i].co=="-"){
										if(result[i].ao=="Approved"||result[i].ao=="-"){
											var to = moment(result[i].date, 'DD/MM/YYYY');
											result[i].date= to.format('DD-MM-YYYY');
							
											final.push(result[i]);
										}
									}
								}
							}
						}
			
		}
		console.log(final);
		res.send(final);
		

	});
	}
});




router.get('/compensationget',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
			res.sendFile(path.join(__dirname + '/applycompensation.html'));
			return next(req);
		
	}
});

router.get('/profile',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		if(req.session.desi=="co"|| req.session.desi=="Admin"){
			res.sendFile(path.join(__dirname + '/coprofile.html'));
			return next(req);
		}
		else{
			res.sendFile(path.join(__dirname + '/profilenew.html'));
			return next(req);
		}
	}
});

router.get('/applyleave',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		
		console.log(req.session.desi);
		if(req.session.desi=="Admin"){
			res.sendFile(path.join(__dirname + '/applyleaveadmin.html'));
			return next(req);
		}
		else{
			res.sendFile(path.join(__dirname + '/appyleavenew.html'));
			return next(req);
		}
	}
});

router.post('/applyleavenewold',function(req,res,next){
	console.log("enter applyleave");
	console.log(req.body);
	console.log(Object.keys(req.body).length);
	var count=Object.keys(req.body).length;
	var c=count-7;
	console.log(c);
	var no=c/5;
	console.log(no);
	var currenttime=new Date();
	var uuid=date.format(new Date(), 'YYYYMMDDHHmmss');
	uuid = parseInt(uuid);
	uuid=uuid+'k';
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		if(req.body.type && req.body.fromdate && req.body.fromtime && req.body.todate && req.body.totime && req.body.purpose && req.body.numberdays){
			var valid=true;
			if(req.body.fromdate<=req.body.todate){
				User.find("id",req.session.userId,function(result){
					console.log("type      :"+req.body.type);
					if(req.body.type=="Casual"){
						if(result[0].casualavail<=0 || result[0].casualavail-req.body.numberdays<0){
							var llb=result[0].llb+req.body.numberdays;
							req.body.type="LLP";
							User.update("users","llb",llb,"id",result[0].id,function(output){
								console.log(output);
							});
							/*
							valid=false;
							req.flash("message","your limit crossed");
							res.sendFile(path.join(__dirname + '/appyleavenew.html'));*/
						}
					}
					if(req.body.type=="Vacation"){
						if(result[0].vacationavail<=0 || result[0].vacationavail-req.body.numberdays<0){
							var llb=result[0].llb+req.body.numberdays;
							req.body.type="LLP";
							User.update("users","llb",llb,"id",result[0].id,function(output){
								console.log(output);
							});
							/*valid=false;
							req.flash("message","your limit crossed");
							res.sendFile(path.join(__dirname + '/appyleavenew.html'));*/
						}
					}
					if(req.body.type=="Onduty"){
						if(result[0].ondutyavail<=0 || result[0].ondutyavail-req.body.numberdays<0){
							var llb=result[0].llb+req.body.numberdays;
							req.body.type="LLP";
							User.update("users","llb",llb,"id",result[0].id,function(output){
								console.log(output);
							});
							/*valid=false;
							req.flash("message","your limit crossed");
							res.sendFile(path.join(__dirname + '/appyleavenew.html'));*/
						}
					}
					if(req.body.type=="Medical"){
						if(result[0].casualavail<=0 || result[0].casualavail-req.body.numberdays<0){
							var llb=result[0].llb+req.body.numberdays;
							req.body.type="LLP";
							User.update("users","llb",llb,"id",result[0].id,function(output){
								console.log(output);
							});
							/*
							valid=false;
							req.flash("message","your limit crossed");
							res.sendFile(path.join(__dirname + '/appyleavenew.html'));*/
						}
					}
					if(valid){
					var desi=result[0].desi;
					var staffidid=result[0].staffidid;
					var dept=result[0].dept;
					var name=result[0].name;
					console.log(no);
					//if(req.session.desi!="office"){
						if(req.body.sstaff1 !='' ){
							for(var i=1;i<=no;i++){
									console.log(req.body['sstaff' + i]);
									User.alter(req.session.userId,req.body['sdate'+i],req.body['speroid'+i],req.body['ssub'+i],req.body['sclass'+i],req.body['sstaff'+i],desi,staffidid,dept,req.body['sstaff' + i],currenttime,uuid,function(resl){
											if(resl){
												console.log("applied alter");
											}
								
								});
							}
						}
					//}
					console.log("applied alter");
					User.insertal(req.session.userId,req.body.type,req.body.fromdate,req.body.todate,req.body.fromtime,req.body.totime,req.body.purpose,result[0].desi,result[0].staffidid,result[0].dept,currenttime,uuid,req.body.numberdays,name,function(result1){
						console.log("appleid leave")
						User.sendMail(req.session.userId,"Alert","your leave applied",function(dd){
							console.log(dd);
						});
						
						//user.find("id",req.session.userId,function(resultfind){
							var noofdays=parseInt(req.body.numberdays);
							if("Casual"==req.body.type){
								console.log(typeof parseInt(req.params.year));
								var casual=result[0].casual+noofdays;
								var casualavail=result[0].casualavail-noofdays;
								User.updatemany("users","casual",casual,"casualavail",casualavail,"id",req.session.userId,function(output){
									if(output){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}
							});
							}
							else if("Vacation"==req.body.type){
								var vacation=result[0].vacation+noofdays;
								var vacationavail=result[0].vacationavail-noofdays;
								User.updatemany("users","vacation",vacation,"vacationavail",vacationavail,"id",req.session.userId,function(output){
									if(output){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}
							});
							}
							else if("Onduty"==req.body.type){
								var onduty=result[0].onduty+noofdays;
								var ondutyavail=result[0].ondutyavail-noofdays;
								User.updatemany("users","onduty",onduty,"ondutyavail",ondutyavail,"id",req.session.userId,function(output){
									if(output){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}
							});
							}
							else if("Compensation"==req.body.type){
								var com=result[0].Compensation-noofdays;
								//var ondutyavail=result[0].ondutyavail-noofdays;
								User.update("users","Compensation",com,"id",req.session.userId,function(output){
									if(output){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}
							});
							}
							else if("Medical"==req.body.type){
								var casual=result[0].casual+noofdays;
								var casualavail=result[0].casualavail-noofdays;
								User.updatemany("users","casual",casual,"casualavail",casualavail,"id",req.session.userId,function(output){
									if(output){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}

							});
							}
							
							else{
								if(result1){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}
							}

						//});
						
					});
					}
				
				});
			}else{
				req.flash("message","Please enter valid date");
				res.sendFile(path.join(__dirname + '/appyleavenew.html'));
			}
		}
		else{
			req.flash("message"," All Fields Required");
			console.log("type         :"+type);
			res.sendFile(path.join(__dirname + '/appyleavenew.html'));
		}
		return next(req)
	}
});

router.post('/applyleavenew',function(req,res,next){
	console.log("enter applyleave");
	console.log(req.body);
	//console.log(Object.keys(req.body).length);
	//var count=Object.keys(req.body).length;
	//var c=count-7;
	//console.log(c);
	//var no=c/5;
	//console.log(no);
	if(req.session.desi=="Admin"){
		var id=req.body.userid;
	}else{
		var id=req.session.userId;
	}
	var currenttime=new Date();
	var uuid=date.format(new Date(), 'YYYYMMDDHHmmss');
	uuid = parseInt(uuid);
	uuid=uuid+'k';
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		if(req.body.type && req.body.fromdate && req.body.fromtime && req.body.todate && req.body.totime && req.body.purpose && req.body.numberdays){
			var valid=true;
			if(req.body.fromdate<=req.body.todate){
				User.find("id",id,function(result){
					console.log("type      :"+req.body.type);
					if(req.body.type=="Casual"){
						if(result[0].casualavail<=0 || result[0].casualavail-req.body.numberdays<0){
							var llb=result[0].llb+req.body.numberdays;
							req.body.type="LLP";
							User.update("users","llb",llb,"id",result[0].id,function(output){
								console.log(output);
							});
							/*
							valid=false;
							req.flash("message","your limit crossed");
							res.sendFile(path.join(__dirname + '/appyleavenew.html'));*/
						}
					}
					if(req.body.type=="Vacation"){
						if(result[0].vacationavail<=0 || result[0].vacationavail-req.body.numberdays<0){
							var llb=result[0].llb+req.body.numberdays;
							req.body.type="LLP";
							User.update("users","llb",llb,"id",result[0].id,function(output){
								console.log(output);
							});
							/*valid=false;
							req.flash("message","your limit crossed");
							res.sendFile(path.join(__dirname + '/appyleavenew.html'));*/
						}
					}
					if(req.body.type=="Onduty"){
						if(result[0].ondutyavail<=0 || result[0].ondutyavail-req.body.numberdays<0){
							var llb=result[0].llb+req.body.numberdays;
							req.body.type="LLP";
							User.update("users","llb",llb,"id",result[0].id,function(output){
								console.log(output);
							});
							/*valid=false;
							req.flash("message","your limit crossed");
							res.sendFile(path.join(__dirname + '/appyleavenew.html'));*/
						}
					}
					if(req.body.type=="Medical"){
						if(result[0].casualavail<=0 || result[0].casualavail-req.body.numberdays<0){
							var llb=result[0].llb+req.body.numberdays;
							req.body.type="LLP";
							User.update("users","llb",llb,"id",result[0].id,function(output){
								console.log(output);
							});
							/*
							valid=false;
							req.flash("message","your limit crossed");
							res.sendFile(path.join(__dirname + '/appyleavenew.html'));*/
						}
					}
					if(valid){
					var desi=result[0].desi;
					var staffidid=result[0].staffidid;
					var dept=result[0].dept;
					var name=result[0].name;
					//console.log(no);
					//if(req.session.desi!="office"){
						//if(req.body.sdate1 !='' ){
							for(var i=1;i<=8;i++){
								if(req.body['sdate' + i] !='' && req.body['speroid' + i] !='' && req.body['sclass' + i] !='' && req.body['ssub' + i] !='' && req.body['sstaff' + i] !=''){
									console.log(req.body['sstaff' + i]);
									var auuid=date.format(new Date(), 'YYYYMMDDHHmmss');
									auuid = parseInt(auuid);
									auuid=auuid+i;

									User.alter(id,req.body['sdate'+i],req.body['speroid'+i],req.body['ssub'+i],req.body['sclass'+i],req.body['sstaff'+i],desi,staffidid,dept,req.body['sstaff' + i],currenttime,uuid,auuid,function(resl){
											if(resl){
												console.log("applied alterdfgdhhkghkdfhkj");
											}
								
								});
							}
						}
					//}
					User.insertal(id,req.body.type,req.body.fromdate,req.body.todate,req.body.fromtime,req.body.totime,req.body.purpose,result[0].desi,result[0].staffidid,result[0].dept,currenttime,uuid,req.body.numberdays,name,function(result1){
						console.log("appleid leave")
						// User.sendMail(req.session.userId,"Alert","your leave applied",function(dd){
						// 	console.log(dd);
						// });
								
						var messagebody={
							name:result[0].name,
							date:req.body.fromdate,
							todate:req.body.todate,
							dept:result[0].dept
						}
						User.sendMailejs(req.session.userId,"Your Leave Applied","leaveapplied",messagebody,function(dd){
							console.log(dd);
						});

						var string=result[0].leavelayer;
						var array = string.split(",");
						for(var i=0;i<array.length;i++){
						
							if(array[i]=="hod"){
								User.findmultiple("users","dept",result[0].dept,"desi","hod",function(hod){

									User.sendMailejs(hod[0].id,"leave ","leavewaiting",messagebody,function(dd){
										console.log(dd);
									});
								});
							}
							if(array[i]=="principal"){
								User.find("desi","principal",function(principal){
									User.sendMailejs(principal[0].id,"leave","leavewaiting",messagebody,function(dd){
										console.log(dd);
									});
								});
							}
							if(array[i]=="ao"){
								User.find("desi","ao",function(ao){

									User.sendMailejs(ao[0].id,"leave","leavewaiting",messagebody,function(dd){
										console.log(dd);
									});
								});
							}
							if(array[i]=="co"){
								User.find("desi","co",function(co){
									User.sendMailejs(co[0].id,"leave","leavewaiting",messagebody,function(dd){
										console.log(dd);
									});
								});
							}
						}
						
						//user.find("id",req.session.userId,function(resultfind){
							var noofdays=parseFloat(req.body.numberdays);
							if("Casual"==req.body.type){
								console.log(typeof parseInt(req.params.year));
								var casual=result[0].casual+noofdays;
								var casualavail=result[0].casualavail-noofdays;
								User.updatemany("users","casual",casual,"casualavail",casualavail,"id",id,function(output){
									if(output){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}
							});
							}
							else if("Vacation"==req.body.type){
								var vacation=result[0].vacation+noofdays;
								var vacationavail=result[0].vacationavail-noofdays;
								User.updatemany("users","vacation",vacation,"vacationavail",vacationavail,"id",id,function(output){
									if(output){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}
							});
							}
							else if("Onduty"==req.body.type){
								var onduty=result[0].onduty+noofdays;
								var ondutyavail=result[0].ondutyavail-noofdays;
								User.updatemany("users","onduty",onduty,"ondutyavail",ondutyavail,"id",id,function(output){
									if(output){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}
							});
							}
							else if("Compensation"==req.body.type){
								var com=result[0].Compensation-noofdays;
								//var ondutyavail=result[0].ondutyavail-noofdays;
								User.update("users","Compensation",com,"id",id,function(output){
									if(output){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}
							});
							}
							else if("Medical"==req.body.type){
								var casual=result[0].casual+noofdays;
								var casualavail=result[0].casualavail-noofdays;
								User.updatemany("users","casual",casual,"casualavail",casualavail,"id",id,function(output){
									if(output){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}

							});
							}
							
							else{
								if(result1){
									//res.sendFile(path.join(__dirname + '/main.html'));
									return res.redirect('/');
									}
							}

						//});



						
					});
					}
				
				});
			}else{
				req.flash("message","Please enter valid date");
				res.sendFile(path.join(__dirname + '/appyleavenew.html'));
			}
		}
		else{
			req.flash("message"," All Fields Required");
			console.log("type         :"+type);
			res.sendFile(path.join(__dirname + '/appyleavenew.html'));
		}
		return next(req)
	}
});




router.post('/applypermission',function(req,res,next){
	console.log("enter permission");
		
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log("enter permission");
		if( req.body.date && req.body.time){
			console.log(req.body);
			var currenttime=new Date();
			var f=new Date(req.body.date);
			date1 = new Date(currenttime.setDate(currenttime.getDate() -1));
			var currenttime=moment(currenttime,'DD/MM/YYYY');
			currenttime= currenttime.format('DD-MM-YYYY');
			var date1=moment(date1,'DD/MM/YYYY');
			date1= date1.format('DD-MM-YYYY');
			var f=moment(f,'DD/MM/YYYY');
			f= f.format('DD-MM-YYYY');
							
			console.log(currenttime);
			console.log(f);
			console.log(date1)
			if(currenttime<f){
			 console.log("enter here");
				var uuid=date.format(new Date(), 'YYYYMMDDHHmmss');
				uuid = parseInt(uuid);
				uuid=uuid+'k';
				User.find("id",req.session.userId,function(result){
					/*var messagebody={};
					messagebody.date=req.body.date;
					messagebody.time=req.body.time;
					messagebody.name=result[0].name;
					messagebody.template="permissionapplied";
					*/
					if(result[0].permissionavail>0){
						User.insertper(req.session.userId,req.body.date,req.body.time,result[0].desi,result[0].staffidid,result[0].dept,currenttime,uuid,result[0].name,function(result1){
							//window.alert("Permission Applied Successfully!!!");
							var permission=result[0].permission+1;
							var permissionavail=result[0].permissionavail-1;
							User.updatemany("users","permission",permission,"permissionavail",permissionavail,"id",req.session.userId,function(output){
									if(output){
										//res.sendFile(path.join(__dirname + '/main.html'));
										var messagebody={
											name:result[0].name,
											date:req.body.date,
											time:req.body.time,
											dept:result[0].dept
										}
										User.sendMailejs(req.session.userId,"Your Permission Applied","permissionapplied",messagebody,function(dd){
											console.log(dd);
										});

										var string=result[0].permissionlayer;
										var array = string.split(",");
										for(var i=0;i<array.length;i++){
										
											if(array[i]=="hod"){
												User.findmultiple("users","dept",result[0].dept,"desi","hod",function(hod){

													User.sendMailejs(hod[0].id,"Permission ","permissionwaiting",messagebody,function(dd){
														console.log(dd);
													});
												});
											}
											if(array[i]=="principal"){
												User.find("desi","principal",function(principal){
													User.sendMailejs(principal[0].id,"Permission","permissionwaiting",messagebody,function(dd){
														console.log(dd);
													});
												});
											}
											if(array[i]=="ao"){
												User.find("desi","ao",function(ao){
													User.sendMailejs(ao[0].id,"Permission","permissionwaiting",messagebody,function(dd){
														console.log(dd);
													});
												});
											}
											if(array[i]=="co"){
												User.find("desi","co",function(co){
													User.sendMailejs(co[0].id,"Permission","permissionwaiting",messagebody,function(dd){
														console.log(dd);
													});
												});
											}
										}
										return res.redirect('/');
									}
						});
							
						});
					}else{
						console.log("enter else here");
						req.flash("message"," Alraedy permission limited crossed");
			
						res.sendFile(path.join(__dirname + '/applypermissionnew.html'));
					}
				});
			}
			else{
				req.flash("message","Past permissions are not allowed");
			
				res.sendFile(path.join(__dirname + '/applypermissionnew.html'));
			}
		}
		else{
			req.flash("message"," All Fields Required");
		
			res.sendFile(path.join(__dirname + '/applypermissionnew.html'));
		}
		return next(req);
	}
});


router.post('/reportdateoldd',function(req,res){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log(JSON.stringify(req.body));
		if(req.session.desi=="Admin"||req.session.dept=="all"){
			var dept=req.body.dept;
		}
		else {
			var dept=req.session.dept;
		}
		User.finda("applyleave","dept",dept,function(result){
		console.log(result.length);
		console.log(result);
			var array=[];
		async.forEachSeries(result,function(key,next){
			console.log("key    :"+key.fromdate);
			fromdate= new Date(req.body.from);
			todate= new Date(req.body.to);
			while(fromdate <= todate){
				console.log("fromdate      "+fromdate);
				
				console.log("req.body.input");
				var f=key.fromdate;
				var t=key.todate;
				/*var year=f.getFullYear()
				var month=f.getMonth();
				var date=f.getDate();
				var year1=t.getFullYear()
				var month1=t.getMonth();
				var date1=t.getDate();
				f=new Date(year,month,date);
				t=new Date(year1,month1,date1);*/ 
				console.log("f   :"+key.fromdate);
				console.log("t   :"+key.todate);
				while(f<=t){
					console.log("f         :"+f);
					console.log("fromdate  :"+fromdate);
					
					var date1 = moment(f, 'DD/MM/YYYY');
					var date2=moment(fromdate,'DD/MM/YYYY');
					key.fromdate= date1.format('DD-MM-YYYY');
					date2=date2.format('DD-MM-YYYY');
						
						if(key.fromdate == date2){
							console.log("same     :"+date2);
							array.push(key);
							//next(); 
							
						}
					f = new Date(f.setDate(f.getDate() + 1));
				}
				 fromdate = new Date(fromdate.setDate(fromdate.getDate() + 1));
			}
			next();
		},function(){
			
			/*for(var i=0;i<array.length;i++){
				var time=array[i].todate;
				console.log("time:::::::::::::::;;"+time);
				var d=dateFormat(time, "dd/mm/yyyy");
					console.log(d);
					array[i].todate=d;
			}*/
			console.log(array);
			req.session.export=array;
			res.send(array);
		});
		});
	}
});


router.post('/reportdateold',function(req,res){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log(JSON.stringify(req.body));
		if(req.session.desi=="Admin"||req.session.dept=="all"){
			var dept=req.body.dept;
		}
		else {
			var dept=req.session.dept;
		}
		User.finda("applyleave","dept",dept,function(result){
		console.log(result.length);
		console.log(result);
			var array=[];
			fromdate= new Date(req.body.from);
			todate= new Date(req.body.to);
			
		async.forEachSeries(result,function(key,next){
		//for(var i=0;i<result.length;i++){
			console.log("key    :"+key.fromdate);
			while(fromdate <= todate){
				//console.log("fromdate      "+fromdate);
				
				//console.log("req.body.input");
				var f=key.fromdate;
				var t=key.todate;
				//f = new Date(f.setDate(f.getDate() - 1));
				//t = new Date(t.setDate(t.getDate() - 1));
				/*var year=f.getFullYear()
				var month=f.getMonth();
				var date=f.getDate();
				var year1=t.getFullYear()
				var month1=t.getMonth();
				var date1=t.getDate();
				f=new Date(year,month,date);
				t=new Date(year1,month1,date1);*/ 
				console.log("f   :"+f);
				console.log("t   :"+t);
				while(f<=t){
					console.log("formate     =======")
					console.log(key);
					console.log("f-------       --:"+f);
					console.log("fromdate-------  :"+fromdate);
					
					var date1 = moment(f, 'DD/MM/YYYY');
					var date2=moment(fromdate,'DD/MM/YYYY');
					key.fromdate= date1.format('DD-MM-YYYY');
					date2=date2.format('DD-MM-YYYY');
					
					console.log("ffffffffrom date"+key.fromdate);
					console.log("tttttttttto date"+date2);
						if(key.fromdate == date2){
							console.log("same     :"+date2);
							array.push(key);
							//next(); 
							
						}
					f = new Date(f.setDate(f.getDate() + 1));
				}
				 fromdate = new Date(fromdate.setDate(fromdate.getDate() + 1));
			}
			next();
		},function(){
			
			/*for(var i=0;i<array.length;i++){
				var time=array[i].todate;
				console.log("time:::::::::::::::;;"+time);
				var d=dateFormat(time, "dd/mm/yyyy");
					console.log(d);
					array[i].todate=d;
			}*/
			console.log(array);
			req.session.export=array;
			res.send(array);
		});
		
		});
	}
});

router.post('/reportdate',function(req,res){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log(JSON.stringify(req.body));
		if(req.session.desi=="Admin"||req.session.dept=="all"){
			var dept=req.body.dept;
		}
		else {
			var dept=req.session.dept;
		}

		var find=req.body.from+'-'+req.body.to;
		
		var array=[];
		User.findreport("applyleave",find,function(result){
			for(var i=0;i<result.length;i++){
				if(result[i].dept==dept){
					var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
					var date2=moment(result[i].todate,'DD/MM/YYYY');
					result[i].fromdate= date1.format('DD-MM-YYYY');
					result[i].todate=date2.format('DD-MM-YYYY');
					if(req.body.LLP=="LLP"){
						if(result[i].type=="LLP"){
							array.push(result[i]);
						}

					}else{
					array.push(result[i]);
					}
				}
			}
			req.session.export=array;
			res.send(array);
		});
		
		
	}
});


router.post('/reportdateold',function(req,res){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{

		console.log(JSON.stringify(req.body));
		if(req.session.desi=="Admin"||req.session.dept=="all"){
			var dept=req.body.dept;
		}
		else {
			var dept=req.session.dept;
		}
		User.finda("applyleave","dept",dept,function(result){
			var array=[];
			console.log(result.length);
		//async.forEachSeries(result,function(key,next){
		for(var i=0;i<result.length;i++){
			//console.log("key    :"+key.fromdate);
			fromdate= new Date(req.body.from);
			todate= new Date(req.body.to);
			while(fromdate <= todate){
				console.log(fromdate);
				//console.log(result[i]);
				var f=result[i].fromdate;
				var t=result[i].todate;
				var year=f.getFullYear();
				var month=f.getMonth();
				var date=f.getDate();
				var year1=t.getFullYear();
				var month1=t.getMonth();
				var date1=t.getDate();
				f=new Date(year,month,date);
				t=new Date(year1,month1,date1);
				console.log("f   :"+f);
				console.log("t   :"+t);
				while(f<=t){
					console.log("f         :"+f);
					console.log("fromdate  :"+t);
					
					var date1 = moment(f, 'DD/MM/YYYY');
					var date2=moment(fromdate,'DD/MM/YYYY');
					result[i].fromdate= date1.format('DD-MM-YYYY');
					date2=date2.format('DD-MM-YYYY');
						//console.log("ffffffffrom date"+result[i].fromdate);
						//console.log("tttttttttto date"+date2);
						if(result[i].fromdate == date2){
							//console.log("same     :"+date2);
							array.push(result[i]);
							//next(); 
							
						}
					f = new Date(f.setDate(f.getDate() + 1));
				}
				 fromdate = new Date(fromdate.setDate(fromdate.getDate() + 1));
			}
			//next();
		}
			
			/*for(var i=0;i<array.length;i++){
				var time=array[i].todate;
				console.log("time:::::::::::::::;;"+time);
				var d=dateFormat(time, "dd/mm/yyyy");
					console.log(d);
					array[i].todate=d;
			}*/
			console.log(array);
			req.session.export=array;
			res.send(array);
		
		});
	}
});


router.get('/reportidleave/:nn',function(req,res){
console.log("enter report id leave");
	var id=req.params.nn;
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		var want=req.flash('want');
console.log(want[0]);
		if(want[0]!="LLP"){
				User.finda("applyleave","_id",id,function(result){
				var array=[];
				for(var i=0;i<result.length;i++){
					var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
					var date2=moment(result[i].todate,'DD/MM/YYYY');
					result[i].fromdate= date1.format('DD-MM-YYYY');
					result[i].todate=date2.format('DD-MM-YYYY');
				}
			
				//res.send(result);
				var string=JSON.stringify(result);
				var data=JSON.parse(string);

				//var data=result;
				var json2xls = require('json2xls');
				var xls = json2xls(data,{fields:['name','desi','dept','type','fromdate','todate','purpose','numberofdays','hod','principal','ao','co']});
				var name=result[0].name;
				fs.writeFileSync('data.xlsx', xls, 'binary');
				var file ='data.xlsx';
				
				res.download(file, 'report.xlsx');
				});
		}else{
				
				User.findmultiple("applyleave","_id",id,"type","LLP",function(result){
				//User.finda("applyleave","_id",id,function(result){
				var array=[];
				for(var i=0;i<result.length;i++){
					var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
					var date2=moment(result[i].todate,'DD/MM/YYYY');
					result[i].fromdate= date1.format('DD-MM-YYYY');
					result[i].todate=date2.format('DD-MM-YYYY');
				}
			
				//res.send(result);
				var string=JSON.stringify(result);
				var data=JSON.parse(string);

				//var data=result;
				var json2xls = require('json2xls');
				var xls = json2xls(data,{fields:['name','desi','dept','type','fromdate','todate','purpose','numberofdays','hod','principal','ao','co']});
				var name=result[0].name;
				fs.writeFileSync('data.xlsx', xls, 'binary');
				var file ='data.xlsx';
				
				res.download(file, 'report.xlsx');
				});
		
		}

	}
});

router.post('/reportidpost',function(req,res){
	console.log("enter report");
		var id=req.body.id;
		var select=req.body.select;
		console.log(req.body);
		if(req.session.userId == undefined){
			res.send("You are not Authorized");
		}
		else{
			if(select=="leave"){
				req.flash("want",req.body.LLP);
				if(req.body.LLP!="LLP"){
					console.log(req.body.LLP);
					User.finda("applyleave","_id",id,function(result){
					//var array=[];
						for(var i=0;i<result.length;i++){
							var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
							var date2=moment(result[i].todate,'DD/MM/YYYY');
							result[i].fromdate= date1.format('DD-MM-YYYY');
							result[i].todate=date2.format('DD-MM-YYYY');
						}
						
						res.send(result);
					});
				}else{
					User.findmultiple("applyleave","_id",id,"type","LLP",function(result){
						//var array=[];
							for(var i=0;i<result.length;i++){
								var date1 = moment(result[i].fromdate, 'DD/MM/YYYY');
								var date2=moment(result[i].todate,'DD/MM/YYYY');
								result[i].fromdate= date1.format('DD-MM-YYYY');
								result[i].todate=date2.format('DD-MM-YYYY');
							}
							res.send(result);
						});

				}
			}else if(select=="permission"){
				User.finda("permission","_id",id,function(result){
				//var array=[];
					for(var i=0;i<result.length;i++){
						var date1 = moment(result[i].date, 'DD/MM/YYYY');
						result[i].date= date1.format('DD-MM-YYYY');
						
					}
					res.send(result);
				});
			}
		}
	});
	

router.get('/reportidpermission/:nn',function(req,res){

	var id=req.params.nn;
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		
		User.finda("permission","_id",id,function(result){
		var array=[];
		for(var i=0;i<result.length;i++){
			var date1 = moment(result[i].date, 'DD/MM/YYYY');
			result[i].date= date1.format('DD-MM-YYYY');
			
		}
		//res.send(result);

		var string=JSON.stringify(result);
		var data=JSON.parse(string);
		var json2xls = require('json2xls');
		var xls = json2xls(data,{fields:['name','desi','dept','date','time','hod','principal','ao','co']});

		fs.writeFileSync('data.xlsx', xls, 'binary');
		var file = 'data.xlsx';
		//var name=result[0].name;
		res.download(file, 'report.xlsx'); 

		});
	}
});



router.get('/export',function(req,res,next){  
	
	console.log("enter the export");
	console.log("deleting user leave "+JSON.stringify(req.session.export)+"");
var string=JSON.stringify(req.session.export);
var data=JSON.parse(string);
console.log(data);
//	const Json2csvParser = require('json2csv').Parser;
//	var fs = require('fs');

//const fields = ['name','fromdate','todate', 'type'];
  
//const json2csvParser = new Json2csvParser({ fields });
//const csv = json2csvParser.parse(data);
/*var xls=json2xls(data,{fields:['name','fromdate','todate', 'type']});

fs.writeFilesync('data.xlsx', xls, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
console.log(csv);
*/
var json2xls = require('json2xls');
// var json = {
//     foo: 'bar',
//     qux: 'moo',
//     poo: 123,
//     stux: new Date()
// }
//console.log(json);
var xls = json2xls(data,{fields:['name','dept','fromdate','todate', 'type','numberofdays','purpose']});

fs.writeFileSync('data.xlsx', xls, 'binary');
var file = 'data.xlsx';
console.log(file);
res.download(file, 'reportfile.xlsx'); 
  
  //res.xls('data.xlsx',xls);
});


router.get('/applyper',function(req,res,next){
	//console.log("Requested");
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		res.sendFile(path.join(__dirname + '/applypermissionnew.html'));
		return next(req);
	}
});
router.get('/reportbyid',function(req,res,next){
	//console.log("Requested");
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		res.sendFile(path.join(__dirname + '/reportid.html'));
		return next(req);
	}
});

router.get('/allusers',function(req,res,next){
	//console.log("Requested");
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log("Inside");
		console.log(req.session.desi);
		if(req.session.desi!="hod"){
			console.log("all user");
			User.findall("users",function(data){
				console.log(data);
				res.send(data);
			});
		}else{
			console.log(" dept wise");
			User.finda("users","dept",req.session.dept,function(data){
				console.log(data);
				res.send(data);
			});

		}
		//res.sendFile(path.join(__dirname + '/reportid.html'));
		return next(req);
	}
});

router.get('/allc',function(req,res,next){
	//console.log("Requested");
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		console.log("Inside");
		User.findclass("cc","extra",function(data){
			//console.log(data);
			res.send(data);
		});
		//res.sendFile(path.join(__dirname + '/reportid.html'));
		return next(req);
	}
});
router.post('/subject',function(req,res,next){  
	console.log("subject");
	var nn=req.body.clas;
	console.log("updating user leave "+nn+"");
	User.finda("extra","cc",nn,function(data){
		res.send(data);
	
	});
	
	return next(req);
});


router.get('/exportusers',function(req,res,next){  
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		
		User.findall("users",function(result){
			console.log(result);	
			var string=JSON.stringify(result);
			var data=JSON.parse(string);
			var json2xls = require('json2xls');
			var xls = json2xls(data,{fields:['name','username','dept','desi','dob','gender','mobilenumber','staffidid','casualavail','vacationavail','ondutyavail','permissionavail','casual','vacation','onduty','permission','llb','Compensation','leavelayer','permissionlayer']});

			fs.writeFileSync('data.xlsx', xls, 'binary');
			var file = 'data.xlsx';
			res.download(file, 'reportfile.xlsx'); 
	
		});
	}
  
});





router.get('/leavedetails',function(req,res,next){
	//console.log("Requested");
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		res.sendFile(path.join(__dirname + '/leavedetailsnew.html'));
		return next(req);
	}
});


router.get('/profile',function(req,res,next){
	//console.log("Requested");
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		res.sendFile(path.join(__dirname + '/profilenew.html'));
		return next(req);
	}
});

router.get('/admin',function(req,res,next){
	//console.log("Requested");
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		res.sendFile(path.join(__dirname + '/adminmain.html'));
		return next(req);
	}
});

router.get('/createuser',function(req,res,next){
	//console.log("Requested");
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		//console.log("Inside");
		res.sendFile(path.join(__dirname + '/index2.html'));
		return next(req);
	}
});

router.post('/',function(req,res,next){
	console.log(req.body);
	if(req.body.usermail && req.body.userpassword){
		User.authenticate(req.body.usermail,req.body.userpassword,function(error,result,usid,desi,dept){
			if(result == true){
				console.log("Password Matched");
				//console.log(desi);
				if(desi=="professor")
				{
				req.session.userId = usid;
				req.session.desi = desi;
				return res.redirect('/home');
				}
				else if(desi=="principal" || desi=="hod")
				{
					req.session.userId = usid;
					req.session.desi = desi;
					req.session.dept = dept;
					return res.redirect('/hod');
				}
				else if(desi=="Admin"){
					req.session.userId = usid;
					req.session.desi = desi;
					return res.redirect('/admin');
				}
				else if(desi=="co"){
					req.session.userId = usid;
					req.session.desi = desi;
					req.session.dept = dept;
					return res.redirect('/co');
				}
				else if(desi=="ao"){
					req.session.userId = usid;
					req.session.desi = desi;
					req.session.dept = dept;
					return res.redirect('/hod');
				}
				else if(desi=="office"){
					req.session.userId = usid;
					req.session.desi = desi;
					return res.redirect('/office');
				}else{
				req.session.userId = usid;
				req.session.desi = desi;
				return res.redirect('/home');
				}
						
			}
			else{
				console.log(error);
				req.flash("message",error);
				return res.redirect('/');
			}
		});
	}
	else if(req.body.usersmail && req.body.userspassword && req.body.desi && req.body.mobilenumber && req.body.name && req.body.staffid && req.body.dept){	
			User.insert(req.body.usersmail,req.body.userspassword,req.body.mobilenumber,req.body.name,req.body.desi,req.body.staffid,req.body.dept,req.body.gender,req.body.dob,req.body.casualavail,req.body.vacationavail,req.body.ondutyavail,req.body.permissionavail,req.body.leavelayer,req.body.permissionlayer,function(error,result,usid){
				if(result == true){                                              
					console.log("User Created");
					req.session.userId = usid;
					return res.redirect('/');
				}
				else{
					console.log(error);
					return res.send(error);
				}
			});
			
	}
	else{
		console.log("all fields required");
		req.flash("message"," All Fields Required");
		return res.redirect('/');
				 
		//return res.send("All Fields Required");
	}
});

router.get('/flash',function(req,res){
	res.send(req.flash('message'));
});


router.get('/delete/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("deleting user leave "+nn+"");
	User.finda("applyleave","uuid",nn,function(data){
		if(data[0].cancel=="false"){
			User.find("id",data[0]._id,function(userdata){
				if(data[0].type=="Casual"){
					var availans=data[0].numberofdays+userdata[0].casualavail;
					
					if(data[0].numberofdays>userdata[0].casual)
					var ans=data[0].numberofdays-userdata[0].casual;
					else
					var ans=userdata[0].casual-data[0].numberofdays;
					User.updatemany("users","casual",ans,"casualavail",availans,"id",req.session.userId,function(output){
						console.log(output);
				   });
				}
				else if(data[0].type=="Vacation"){
					var availans=data[0].numberofdays+userdata[0].vacationavail;
					
					if(data[0].numberofdays>userdata[0].vacation)
					var ans=data[0].numberofdays-userdata[0].vacation;
					else
					var ans=userdata[0].vacation-data[0].numberofdays;
					User.updatemany("users","vacation",ans,"vacationavail",availans,"id",req.session.userId,function(output){
						console.log(output);
				   });
				}else if(data[0].type=="Onduty"){
					var availans=data[0].numberofdays+userdata[0].ondutyavail;
					
					if(data[0].numberofdays>userdata[0].onduty)
					var ans=data[0].numberofdays-userdata[0].onduty;
					else
					var ans=userdata[0].onduty-data[0].numberofdays;
					User.updatemany("users","onduty",ans,"ondutyavail",availans,"id",req.session.userId,function(output){
						console.log(output);
				   });
				}else if(data[0].type=="LLP"){
					//var availans=data[0].numberofdays+userdata[0].ondutyavail;
					
					if(data[0].numberofdays>userdata[0].llb)
					var ans=data[0].numberofdays-userdata[0].llb;
					else
					var ans=userdata[0].llb-data[0].numberofdays;
					User.update("users","llb",ans,"id",req.session.userId,function(output){
						console.log(output);
				   });
				}else if(data[0].type=="Compensation"){
					//var availans=data[0].numberofdays+userdata[0].ondutyavail;
					
					if(data[0].numberofdays>userdata[0].Compensation)
					var ans=data[0].numberofdays-userdata[0].Compensation;
					else
					var ans=userdata[0].Compensation-data[0].numberofdays;
					User.update("users","Compensation",ans,"id",req.session.userId,function(output){
						console.log(output);
				   });
				}
				
				if(data[0].hod=="Approved"){
					User.findmultiple("users","desi","hod","dept",userdata[0].dept,function(hoddata){
						User.sendMail(hoddata[0].id,"Alert","Leave canceled:"+data[0].uuid,function(dd){
							console.log(dd);
						});
						
					});

				}
				if(data[0].principal=="Approved"){
					User.find("desi","principal",function(principaldata){
						
						User.sendMail(principaldata[0].id,"Alert","Leave canceled:"+userdata[0].uuid,function(dd){
							console.log(dd);
						});
						
					});


				}
				if(data[0].co=="Approved"){
					User.find("desi","co",function(codata){
						
						User.sendMail(codata[0].id,"Alert","Leave canceled:"+userdata[0].uuid,function(dd){
							console.log(dd);
						});
						
					});

					
				}
				if(data[0].ao=="Approved"){
					User.find("desi","ao",function(aodata){
						
						User.sendMail(aodata[0].id,"Alert","Leave canceled:"+userdata[0].name,function(dd){
							console.log(dd);
						});
						
					});

				}



			});
		}
	});
	
	User.deleterow(nn,"applyleave",function(err,result){
			console.log("deleted");
			return res.redirect('/appliedlve');		
	});

		User.deleterow(nn,"leavesecond",function(err,result1){
			console.log(result1);
		});
});





router.get('/deleteper/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("deleting user leave "+nn+"");
	User.finda("permission","uuid",nn,function(data){
		if(data[0].cancel=="false"){
			console.log(data);
			User.find("id",data[0]._id,function(userdata){
				console.log(userdata);
					var availans=1+userdata[0].permissionavail;
					
					if(1>userdata[0].permission)
					var ans=1-userdata[0].permission;
					else
					var ans=userdata[0].permission-1;
					console.log("ans    :"+ans);
					console.log("availans  :"+availans);
					User.updatemany("users","permission",ans,"permissionavail",availans,"id",req.session.userId,function(output){
						console.log(output);
					});
					
					
					if(data[0].hod=="Approved"){
						User.findmultiple("users","desi","hod","dept",userdata[0].dept,function(hoddata){
							User.sendMail(hoddata[0].id,"Alert","Leave canceled:"+data[0].uuid,function(dd){
								console.log(dd);
							});
							
						});
	
					}
					if(data[0].principal=="Approved"){
						User.find("desi","principal",function(principaldata){
							
							User.sendMail(principaldata[0].id,"Alert","Leave canceled:"+userdata[0].uuid,function(dd){
								console.log(dd);
							});
							
						});
	
	
					}
					if(data[0].co=="Approved"){
						User.find("desi","co",function(codata){
							
							User.sendMail(codata[0].id,"Alert","Leave canceled:"+userdata[0].uuid,function(dd){
								console.log(dd);
							});
							
						});
	
						
					}
					if(data[0].ao=="Approved"){
						User.find("desi","ao",function(aodata){
							
							User.sendMail(aodata[0].id,"Alert","Leave canceled:"+userdata[0].name,function(dd){
								console.log(dd);
							});
							
						});
	
					}
				
			});
		}
	});

	User.deleterow(nn,"permission",function(err,result){ 
		
			console.log("deleted");
			return res.redirect('/appliedper');
	});
});

router.get('/deletecompensation/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("deleting user compensation "+nn+"");
	User.finda("compensation","uuid",nn,function(data){
		User.finda("users","id",data[0].id,function(user){
		var ans=user[0].Compensation-1;
		if(data[0].cancel=="true"){
			User.update("users","Compensation",ans,"id",req.session.userId,function(output){
				console.log(output);
		   });
		   
		}
	});
	});
	User.deleterow(nn,"compensation",function(err,result){ 
		
			console.log("deleted");
			return res.redirect('/appliedlve');
	});
	
});


router.get('/deleteclass/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("deleting class "+nn+"");
	User.deletecommon("extra","cc",nn,function(err,result){ 
		
			console.log("deleted");
			return res.redirect('/extradata');
	});
	
});

router.get('/cancelcompensation/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("cancel user compensation "+nn+"");
	/*User.finda("compensation","uuid",nn,function(data){
		console.log(data);
		User.finda("users","id",data[0].id,function(user){
		var ans=user[0].Compensation-1;
		if(data[0].cancel=="false"){
			User.update("users","Compensation",ans,"id",user[0].id,function(output){
				console.log(output);
		   });
		   User.update("compensation","cancel","true","uuid",nn,function(data1){
			console.log(data1);
	   		});
		}
		});
	});*/
	User.update("compensation",req.session.desi,"Canceled","uuid",nn,function(output){
		console.log(output);
		return res.redirect('/notification');

   });
	
});
router.get('/acceptcompensation/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("acceptuser compensation "+nn+"");
	/*User.finda("compensation","uuid",nn,function(data){
		var ans=data[0].Compensation-1;
		if(data[0].cancel=="false"){
			User.update("users","Compensation",ans,"id",req.session.userId,function(output){
				console.log(output);
		   });
		}
	});*/
	
	User.update("compensation",req.session.desi,"Approved","uuid",nn,function(output){
		console.log(output);
		return res.redirect('/notification');

   });

	User.finda("compensation","uuid",nn,function(data){
		if(data[0].hod == "Approved" || data[0].hod == "-" ){
			if(data[0].principal == "Approved" || data[0].principal == "-" ){
				if(data[0].co == "Approved" || data[0].co == "-" ){
					if(data[0].ao == "Approved" || data[0].ao == "-" ){
						User.finda("users","id",data[0].id,function(userdata){
										var compensation=1+userdata[0].Compensation;
										User.update("users","compensation",compensation,"id",userdata[0].id,function(output){
											console.log(output);
										});
										User.update("compensation","cancel","true","uuid",nn,function(output){
											console.log(output);
										});
						});
					}
				}
			}
		}
	});

	
	
});

router.get('/deleteuser/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;

	User.deleteuser("users",nn,function(err,result){ 
		
			console.log("deleted");
			return res.redirect('/users');
	});
});

router.get('/deleteleave/:nnn',function(req,res,next){   
	
	var nn=req.params.nnn;

	User.deleteuser("users",nn,function(err,result){ 
		
			console.log("deleted");
			return res.redirect('/leave');
	});
});

router.get('/accept/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("updating user leave "+nn+"");
	
	User.update("applyleave",req.session.desi,"Approved","uuid",nn,function(err,result){
				console.log("approved");
			User.finda("applyleave","uuid",nn,function(id){
				User.sendMail(id[0]._id,"Alert","your leave approved",function(dd){
					console.log(dd);
				});
			});
				if(req.session.desi=="co"){
					return res.redirect('/co');	
				}else
				return res.redirect('/notification');
					
	});
});

router.get('/alterok/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("updating user leave "+nn+"");
	
	User.update("leavesecond","status","Approved","alterid",nn,function(err,result){
				console.log("approved");
				User.sendMail(req.session.userId,"Alert","your leave approved",function(dd){
					console.log(dd);
				});
				
				return res.redirect('/alteracceptance');
			
					
	});
});
router.get('/alternotok/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("updating user leave "+nn+"");
	
	User.update("leavesecond","status","Canceled","alterid",nn,function(err,result){
				console.log("approved");
				User.sendMail(req.session.userId,"Alert","your leave approved",function(dd){
					console.log(dd);
				});
				
				if(req.session.desi=="co"){
					return res.redirect('/co');	
				}else
				return res.redirect('/alteracceptance');
			
					
	});
});


router.get('/acceptper/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("updating user leave "+nn+"");
	
	User.update("permission",req.session.desi,"Approved","uuid",nn,function(err,result){
			console.log("enter back update");
			User.finda("permission","uuid",nn,function(id){
				User.sendMail(id[0]._id,"Alert","your leave approved",function(dd){
					console.log(dd);
				});
			});
			if(req.session.desi=="co"){
				return res.redirect('/co');	
			}else
			return res.redirect('/notification');
		
					
	});
});

router.get('/cancel/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("canceling user leave "+nn+"");
	
	User.finda("applyleave","uuid",nn,function(data){
		if(data[0].cancel=="false"){
			User.find("id",data[0]._id,function(userdata){
				if(data[0].type=="Casual" || data[0].type=="Medical"){
					var availans=data[0].numberofdays+userdata[0].casualavail;
					
					if(data[0].numberofdays>userdata[0].casual)
					var ans=data[0].numberofdays-userdata[0].casual;
					else
					var ans=userdata[0].casual-data[0].numberofdays;
					User.updatemany("users","casual",ans,"casualavail",availans,"id",data[0]._id,function(output){
						console.log(output);
				   });
				}
				if(data[0].type=="Vacation"){
					var availans=data[0].numberofdays+userdata[0].vacationavail;
					
					if(data[0].numberofdays>userdata[0].vacation)
					var ans=data[0].numberofdays-userdata[0].vacation;
					else
					var ans=userdata[0].vacation-data[0].numberofdays;
					User.updatemany("users","vacation",ans,"vacationavail",availans,"id",data[0]._id,function(output){
						console.log(output);
				   });
				}
				if(data[0].type=="Onduty"){
					var availans=data[0].numberofdays+userdata[0].ondutyavail;
					
					if(data[0].numberofdays>userdata[0].onduty)
					var ans=data[0].numberofdays-userdata[0].onduty;
					else
					var ans=userdata[0].ondyty-data[0].numberofdays;
					User.updatemany("users","onduty",ans,"ondutyavail",availans,"id",data[0]._id,function(output){
						console.log(output);
				   });
				}
				 
				if(data[0].type=="Compensation"){
					var availans=data[0].numberofdays+userdata[0].ondutyavail;
					
					if(data[0].numberofdays>userdata[0].onduty)
					var ans=data[0].numberofdays-userdata[0].Compensation;
					else
					var ans=userdata[0].Compensation-data[0].numberofdays;
					User.update("users","compensation",ans,"id",data[0]._id,function(output){
						console.log(output);
				   });
				}

				
				User.finda("applyleave","uuid",nn,function(id){
					User.sendMail(id[0]._id,"Alert","your leave approved",function(dd){
						console.log(dd);
					});
				});				
			});
			User.update("applyleave","cancel","true","uuid",nn,function(update){
				console.log(update);
			});
		}
	});
	

	User.update("applyleave",req.session.desi,"Canceled","uuid",nn,function(err,result){
			console.log("canceled");
			if(req.session.desi=="co"){
				return res.redirect('/co');	
			}else
			return res.redirect('/notification');
		
					
	});
});

router.get('/approvellb/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("canceling user leave "+nn+"");
	
	User.finda("applyleave","uuid",nn,function(data){
		//if(data[0].cancel=="false"){
			User.find("id",data[0]._id,function(userdata){
				if(data[0].type=="Casual"){
					var availans=data[0].numberofdays+userdata[0].casualavail;
					
					if(data[0].numberofdays>userdata[0].casual)
					var ans=data[0].numberofdays-userdata[0].casual;
					else
					var ans=userdata[0].casual-data[0].numberofdays;

					var llb=userdata[0].llb+data[0].numberofdays
					User.updatemany("users","casual",ans,"casualavail",availans,"id",data[0]._id,function(output){
						console.log(output);
				   });
				   User.update("applyleave","type","LLP","uuid",nn,function(output){
					console.log(output);
				   });
					User.update("users","llb",llb,"id",data[0]._id,function(output){
					console.log(output);
						});
				}
				User.sendMail(req.session.userId,"Alert","your leave canceled",function(dd){
					console.log(dd);
				});
				
			});
		//}
	});
	

	User.update("applyleave",req.session.desi,"Approved","uuid",nn,function(err,result){
			console.log("canceled");
			if(req.session.desi=="co"){
				return res.redirect('/co');	
			}else
			return res.redirect('/notification');
		
					
	});
});



router.get('/cancelper/:nnn',function(req,res,next){  
	
	var nn=req.params.nnn;
	console.log("canceling user leave "+nn+"");
	
	User.finda("permission","uuid",nn,function(data){
		if(data[0].cancel=="false"){
			console.log(data);
			User.find("id",data[0]._id,function(userdata){
				console.log(userdata);
					var availans=1+userdata[0].casualavail;
					
					if(1>userdata[0].permission)
					var ans=1-userdata[0].permission;
					else
					var ans=userdata[0].permission-1;
					User.updatemany("users","permission",ans,"permissionavail",availans,"id",data[0]._id,function(output){
						console.log(output);
					});
					User.update("permission","cancel","true","uuid",nn,function(update){
						console.log(update);
					});  
					User.finda("permission","uuid",nn,function(id){
						User.sendMail(id[0]._id,"Alert","your leave approved",function(dd){
							console.log(dd);
						});
					});
					 
				
			});
		}
	});


	User.update("permission",req.session.desi,"Canceled","uuid",nn,function(err,result){
			console.log("enter back cancel");
			if(req.session.desi=="co"){
				return res.redirect('/co');	
			}else
			return res.redirect('/notification');
		
					
	});
});

router.get('/userupdate/:nnn',function(req,res){
	//var nn=req.params.nnn;
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		var msg=req.params.nnn;
		req.flash("userid",msg);
		
		console.log("enter userupdate");
		res.sendFile(path.join(__dirname + '/userupdate.html'));
		
	}
});

router.get('/userid',function(req,res){
	//var nn=req.params.nnn;
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		var userid=req.flash('userid');
		req.flash("id",userid[0]);

		User.find("id",userid[0],function(id){
			res.send(id[0]);
		});
		
	}
});



router.post('/updateuser',function(req,res){

console.log(req.body);

var userid=req.flash('id');
	console.log(userid[0]);
	if(req.body.name){
		User.update("users","name",req.body.name,"id",userid[0],function(err,result){
			console.log("enter back update");
			//return res.redirect('/profile');
			
		});
	}
	if(req.body.staffid){
		User.update("users","staffidid",req.body.staffid,"id",userid[0],function(err,result){
			console.log("enter back update");
				//return res.redirect('/notification');
			
		});
	}
	if(req.body.department){
		User.update("users","dept",req.body.department,"id",userid[0],function(err,result){
			console.log("enter back update");
				//return res.redirect('/notification');
			
		});
	}
	if(req.body.dob){
		User.update("users","dob",req.body.dob,"id",userid[0],function(err,result){
			console.log("date-of-birth updated");
				//return res.redirect('/notification');
			
		});
	}
	if(req.body.mobilenumber){
		User.update("users","mobilenumber",req.body.mobilenumber,"id",userid[0],function(err,result){
			console.log("mobilenumber updated");
				//return res.redirect('/notification');
			
		});
	}
	if(req.body.gender){
		User.update("users","gender",req.body.gender,"id",userid[0],function(err,result){
			console.log("gender updated");
				//return res.redirect('/notification');
			
		});
	}
	if(req.body.email){
		User.update("users","username",req.body.email,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	if(req.body.casualavail){
		User.update("users","casualavail",req.body.casualavail,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	if(req.body.vacationavail){
		User.update("users","vacationavail",req.body.vacationavail,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	if(req.body.ondutyavail){
		User.update("users","ondutyavail",req.body.ondutyavail,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	if(req.body.permissionavail){
		User.update("users","permissionavail",req.body.permissionavail,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	if(req.body.casual){
		User.update("users","casual",req.body.casual,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	if(req.body.vacation){
		User.update("users","vacation",req.body.vacation,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	if(req.body.onduty){
		User.update("users","onduty",req.body.onduty,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	if(req.body.permission){
		User.update("users","permission",req.body.permission,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	if(req.body.llb){
		User.update("users","llb",req.body.llb,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	if(req.body.Compensation){
		User.update("users","Compensation",req.body.Compensation,"id",userid[0],function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	return res.redirect('/');




});

router.post('/profileupdate',function(req,res,next){  
	
	console.log("enter profile update");
	//console.log("updating user leave "+nn+"");
	if(req.body.name){
			User.update("users","name",req.body.name,"id",req.session.userId,function(err,result){
				console.log("enter back update");
				//return res.redirect('/profile');
				
			});
	}
	if(req.body.password){
		var pass = req.body.password;
		var password=req.body.password;
				User.encrypt(password,function(err,pass){
					console.log(pass);
					User.update("users","password",pass,"id",req.session.userId,function(err,result){
						console.log("enter back update");
						//return res.redirect('/profile');
				
					});
				});
	}
	if(req.body.staffid){
		User.update("users","staffidid",req.body.staffid,"id",req.session.userId,function(err,result){
			console.log("enter back update");
				//return res.redirect('/notification');
			
		});
	}
	if(req.body.department){
		User.update("users","dept",req.body.department,"id",req.session.userId,function(err,result){
			console.log("enter back update");
				//return res.redirect('/notification');
			
		});
	}
	if(req.body.dob){
		User.update("users","dob",req.body.dob,"id",req.session.userId,function(err,result){
			console.log("date-of-birth updated");
				//return res.redirect('/notification');
			
		});
	}
	if(req.body.mobilenumber){
		User.update("users","mobilenumber",req.body.mobilenumber,"id",req.session.userId,function(err,result){
			console.log("mobilenumber updated");
				//return res.redirect('/notification');
			
		});
	}
	if(req.body.gender){
		User.update("users","gender",req.body.gender,"id",req.session.userId,function(err,result){
			console.log("gender updated");
				//return res.redirect('/notification');
			
		});
	}
	if(req.body.email){
		User.update("users","username",req.body.email,"id",req.session.userId,function(err,result){
			console.log("email updated");
				//return res.redirect('/notification');
			
		});
		
	}
	return res.redirect('/profile');
});

router.get('/logout',function(req,res,next){
	if(req.session.userId == undefined){
		res.send("You are not Authorized");
	}
	else{
		if(req.session){
				 	console.log("User - "+req.session.userId+"- Logged Out");
					req.session.destroy(function(err){
						if(err) return next(err);

						else{
							return res.redirect('/');
						}
					});
	}
  }
});


function main(){

	//monthly permission update
	if(false){ 
	schedule.scheduleJob('10 * * * *', function(){
	  console.log('The answer to life, the universe, and everything! server');
	  User.findall("users",function(result){
		  
		  for(var i=0;i<result.length;i++){
		  User.updatemany("users","permissionavail",3,"permission",0,"id",result[i].id,function(update){
			 
			console.log("data updated");
		  });
		}
	  });
	});
	}
	}

	//yearly leave update
	if(false){ 
		schedule.scheduleJob('42 * * * * *', function(){
		  console.log('The answer to life, the universe, and everything! server');
		  User.findall("users",function(result){
			  
			  for(var i=0;i<result.length;i++){
			  User.updateyearly("users","casualavail",10,"casual",0,"vacationavail",10,"vacation",0,"ondutyavail",10,"onduty",0,"id",result[i].id,function(update){
				 
				
				console.log("leave updated");
			  })
			}
		  });
		});
		}
		

	main();

module.exports=router;