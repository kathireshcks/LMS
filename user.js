const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const date = require('date-and-time');
const nodemailer = require('nodemailer');
var dateFormat = require('dateformat');

var ejs=require("ejs");
var fs=require("fs");

var serverdetails = null,conauth = null;
serverd = function(data){
	serverdetails = data;
	conauth = mysql.createConnection(serverdetails);
}

find = function(col,val,callback){
	
	var ses = "SELECT * FROM users WHERE "+col+"='"+val+"'";
	conauth.query(ses,function(err,result){
	
		if(err) throw err;
		else{
			return callback(result);
		}
	});
}

findidname = function(col,val,callback){
	
	var ses = "SELECT id,name FROM users WHERE "+col+"='"+val+"'";
	conauth.query(ses,function(err,result){
	
		if(err) throw err;
		else{
			return callback(result);
		}
	});
}

findall = function(table,callback){
	
	
	var ses = "SELECT * FROM "+table+" ";
	conauth.query(ses,function(err,result){
	
		if(err) throw err;
		else{
			return callback(result);
		}
	});
}

findclass = function(cc,table,callback){
	
	
	var ses = "SELECT "+cc+" FROM "+table+" ";
	conauth.query(ses,function(err,result){
	
		if(err) throw err;
		else{
			return callback(result);
		}
	});
}


finda = function(tab,col,val,callback){
	
	var ses = "SELECT * FROM "+tab+" WHERE "+col+"='"+val+"'";
	conauth.query(ses,function(err,result){

		if(err) throw err;
		else{
			return callback(result);
		}
	});
}


findreport = function(tab,find,callback){
	
	var ses = "SELECT * FROM "+tab+" WHERE frommy='"+find+"' OR tomy='"+find+"'";

	conauth.query(ses,function(err,result){

		if(err) throw err;
		else{
			return callback(result);
		}
	});
}


/*leavesecond = function(tab,col,val,callback){
console.log("enter leave second");
	finda(tab,col,val,function(output){
		console.log("+++++++++++++++++++++++++++++++++++++++");
		console.log(output.length);
		console.log(output);
		var pending="null";
		var approved="null";
		var canceled="null";
		
		for(var j=0;j<output.length;j++){
			console.log(j);
			if(output[j].status=="Pending"){
				pending="pending";
				
			}
			else if(output[j].status=="Approved"){
				approved="approved";
				
			}else if(output[j].status=="Canceled"){
				canceled="canceled";
				
			}

		}
		
		return callback(canceled,pending,approved);
	});

}*/

findmultiple = function(tab,col1,val1,col2,val2,callback){

	var ses = "SELECT * FROM "+tab+" WHERE "+col1+"='"+val1+"' AND "+col2+"='"+val2+"'";
	
	conauth.query(ses,function(err,result){
	
		if(err) throw err;
		else{
			return callback(result);
		}
	});
}

function ejscommonRender( data , template ){
	var templateString = fs.readFileSync(__dirname + '/templates/ejs_common/'+template+'.ejs', 'utf-8');
	var html_content  = ejs.render(templateString,data);    
	return html_content;
}



authenticate = function(mail,password,callback){
	
	find('username',mail,function(result){
		if(result[0]==null){
			var error = "User not Exists";
			return callback(error,false,null);
		}
		else{
			var usid = result[0].id;
			var desi=result[0].desi;
			var dept=result[0].dept;
			console.log(usid);
			bcrypt.compare(password,result[0].password,function(err,result){
							if(result == true){
								return callback(null,result,usid,desi,dept);
							}
							else{
								var error = "Password Incorrect";
								return callback(error,false,null);
							}
						});
		}
	})
}

encrypt=function(password,callback){
	
	var pass = password;
				bcrypt.hash(pass,10,function(err,hash){
					if(err) throw err;
					console.log(hash);
					return callback(null,hash);
				})
}

insert = function(mail,password,mobilenumber,name,desi,staffid,dept,gender,dob,casualavail,vacationavail,ondutyavail,permissionavail,leavelayer,permissionlayer,callback){
	
	
	find('username',mail,function(result){
		if(result[0]==null){
			encrypt(password,function(err,pass){
				var idn=date.format(new Date(), 'YYYYMMDDHHmmss');
					idn = parseInt(idn);

					var ins = "INSERT INTO users (id,username,password,mobilenumber,name,desi,staffidid,dept,gender,dob,casualavail,vacationavail,ondutyavail,permissionavail,casual,vacation,onduty,permission,forget,llb,Compensation,leavelayer,permissionlayer) VALUES ('"+idn+"','"+mail+"','"+pass+"','"+mobilenumber+"','"+name+"','"+desi+"','"+staffid+"','"+dept+"','"+gender+"','"+dob+"','"+casualavail+"','"+vacationavail+"','"+ondutyavail+"','"+permissionavail+"',0,0,0,0,0,0,0,'"+leavelayer+"','"+permissionlayer+"')";
					conauth.query(ins,function(err,result){
						if(err) throw err;
						else{
							return callback(null,true,idn);
						}
					});
					
				});
		}
		else{
			var error = "User Already exists";
			return callback(error,false,null);
		}
	});
}

insertal = function(id,type,fromdate,todate,fromtime,totime,purpose,desi,staffid,dept,currenttime,uuid,numberofdays,name,callback){
	console.log("enter insertal");
	var hod="-";
var principal="-";
var ao="-";
var co="-";
	find("id",id,function(split){
		
		var string=split[0].leavelayer;
		var array = string.split(",");
		for(var i=0;i<array.length;i++){
			console.log("array  :"+array[i]);
			if(array[i]=="hod"){
				hod="pending";
			}
			if(array[i]=="principal"){
				principal="pending";
			}
			if(array[i]=="ao"){
				ao="pending";
			}
			if(array[i]=="co"){
				co="pending";
			}
		}

	var fromdate1=new Date(fromdate);
	var todate1=new Date(todate);
	
	var fromyear=fromdate1.getFullYear();
	var frommonth=fromdate1.getMonth();
	var toyear=todate1.getFullYear();
	var tomonth=todate1.getMonth();
	frommonth=frommonth+1;
	tomonth=tomonth+1;
	
	var frommy=frommonth+'-'+fromyear;
	var tomy=tomonth+'-'+toyear;
	var cancel=false;
	var insal = "INSERT INTO applyleave (_id,type,fromdate,todate,fromtime,totime,purpose,desi,staffid,dept,hod,principal,co,ao,uuid,appliedtime,numberofdays,name,cancel,frommy,tomy) VALUES ('"+id+"','"+type+"','"+fromdate+"','"+todate+"','"+fromtime+"','"+totime+"','"+purpose+"','"+desi+"','"+staffid+"','"+dept+"','"+hod+"','"+principal+"','"+co+"','"+ao+"','"+uuid+"','"+currenttime+"','"+numberofdays+"','"+name+"','"+cancel+"','"+frommy+"','"+tomy+"')";
	
	conauth.query(insal,function(err,result){
						if(err) throw err;
						else{
							return callback(result);
						}
					});				});
}

alter = function(userId,sdate,speriod,ssub,sclass,sstaff,desi,staffidid,dept,alterstaffid,currenttime,uuid,auuid,callback){
console.log("alter");

	
var status="Pending";
var alterid=auuid;
	findidname("staffidid",alterstaffid,function(staff){
		
	var insal = "INSERT INTO leavesecond (date,period,classs,sub,staffid,_id,desi,dept,alterstaffid,alteruid,appliedtime,uuid,alterid,status,name) VALUES ('"+sdate+"','"+speriod+"','"+sclass+"','"+ssub+"','"+staffidid+"','"+userId+"','"+desi+"','"+dept+"','"+sstaff+"','"+staff[0].id+"','"+currenttime+"','"+uuid+"','"+alterid+"','"+status+"','"+staff[0].name+"')";
	
	conauth.query(insal,function(err,result){
						if(err) throw err;
						else{
							return callback(result);
						}
					});
				});
}

applycompensation = function(id,name,dept,desi,date,uuid,callback){
	
	var hod="-";
var principal="-";
var ao="-";
var co="-";
	find("id",id,function(split){
		var string=split[0].leavelayer;
		var array = string.split(",");
		for(var i=0;i<array.length;i++){
	
			if(array[i]=="hod"){
				hod="pending";
			}
			if(array[i]=="principal"){
				principal="pending";
			}
			if(array[i]=="ao"){
				ao="pending";
			}
			if(array[i]=="co"){
				co="pending";
			}
		}

	var cancel=false;
	var insal = "INSERT INTO compensation (id,name,dept,desi,date,hod,principal,co,ao,uuid,cancel,usethis) VALUES ('"+id+"','"+name+"','"+dept+"','"+desi+"','"+date+"','"+hod+"','"+principal+"','"+co+"','"+ao+"','"+uuid+"','"+cancel+"','notused')";
	
	conauth.query(insal,function(err,result){
						
							return callback(null,result);
						
					});				});
}


insertper = function(id,date,time,desi,staffid,dept,currenttime,uuid,name,callback){
	
var hod="-";
var principal="-";
var ao="-";
var co="-";
	find("id",id,function(split){
		var string=split[0].permissionlayer;
		var array = string.split(",");
		for(var i=0;i<array.length;i++){
			if(array[i]=="hod"){
				hod="pending";
			}
			if(array[i]=="principal"){
				principal="pending";
			}
			if(array[i]=="ao"){
				ao="pending";
			}
			if(array[i]=="co"){
				co="pending";
			}
		}
	/*var hod="Pending";
	if(time=="mor"){
		//if(req.session.desi=="office"){
		//	var principal="Pending";	
		//}
		var principal="-";
	}
	else
	var principal="Pending";
	var co="-";
	*/
	var insal = "INSERT INTO permission (_id,date,time,desi,staffid,dept,appliedtime,uuid,hod,principal,co,ao,name,cancel) VALUES ('"+id+"','"+date+"','"+time+"','"+desi+"','"+staffid+"','"+dept+"','"+currenttime+"','"+uuid+"','"+hod+"','"+principal+"','"+co+"','"+ao+"','"+name+"','false')";
	
	conauth.query(insal,function(err,result){
						if(err) throw err;
						else{
							return callback(result);
						}
					});
	});
}

insertclass= function(table,clas,sub1,sub2,sub3,sub4,sub5,sub6,sub7,sub8,callback){
	var insal = "INSERT INTO extra (cc,sub1,sub2,sub3,sub4,sub5,sub6,sub7,sub8) VALUES ('"+clas+"','"+sub1+"','"+sub2+"','"+sub3+"','"+sub4+"','"+sub5+"','"+sub6+"','"+sub7+"','"+sub8+"')";
	
	conauth.query(insal,function(err,result){
						if(err) throw err;
						else{
							return callback(result);
						}
	});
	
}


update = function(table,replacekey,replacevalue,uuid,id,callback){
	
	//var insal = "UPDATE"+table+" SET "+replacekey+" ='"+replacevalue+"' WHERE uuid ='"+id+"'";
	var insal = "UPDATE "+table+" SET "+replacekey+" ='"+replacevalue+"' WHERE "+uuid+" ='"+id+"'";
	conauth.query(insal,function(err,result){
						if(err) throw err;
						else{
							return callback(result);
						}
					});
}



updatemany = function(table,replacekey,replacevalue,replacekey1,replacevalue1,uuid,id,callback){
	
	//var insal = "UPDATE"+table+" SET "+replacekey+" ='"+replacevalue+"' WHERE uuid ='"+id+"'";
	var insal = "UPDATE "+table+" SET "+replacekey+" ='"+replacevalue+"',"+replacekey1+" ='"+replacevalue1+"' WHERE "+uuid+" ='"+id+"'";
	
	conauth.query(insal,function(err,result){
						if(err) throw err;
						else{
							console.log("update successfull");
							return callback(result);
						}
					});
}

days_between=function(date1, date2,callback) {

    // The number of milliseconds in one day
	var ndays;
	var tv1 = date1.valueOf();  // msec since 1970
	var tv2 = date2.valueOf();
  
	ndays = (tv2 - tv1) / 1000 / 86400;
	ndays = Math.round(ndays - 0.5);
	console.log(ndays);
	return callback(ndays);
}

deleterow = function(uuid,table,callback){
	
	var insal = "DELETE FROM "+table+" WHERE uuid = '"+uuid+"'";
	
	conauth.query(insal,function(err,result){
						if(err) throw err;
						else{
							
							return callback(result);
						}
					});
}

deletecommon = function(table,key,value,callback){
	
	var insal = "DELETE FROM "+table+" WHERE "+key+" = '"+value+"'";
	
	conauth.query(insal,function(err,result){
						if(err) throw err;
						else{
							
							return callback(result);
						}
					});
}

deleteuser= function(table,id,callback){
	
	var insal = "DELETE FROM "+table+" WHERE id = '"+id+"'";
	
	conauth.query(insal,function(err,result){
						if(err) throw err;
						else{
							
							return callback(result);
						}
					});
}


updateyearly = function(table,replacekey,replacevalue,replacekey1,replacevalue1,replacekey2,replacevalue2,replacekey3,replacevalue3,replacekey4,replacevalue4,replacekey5,replacevalue5,uuid,id,callback){
	console.log("enter updateyearly");
	//var insal = "UPDATE"+table+" SET "+replacekey+" ='"+replacevalue+"' WHERE uuid ='"+id+"'";
	var insal = "UPDATE "+table+" SET "+replacekey+" ='"+replacevalue+"',"+replacekey1+" ='"+replacevalue1+"',"+replacekey2+" ='"+replacevalue2+"',"+replacekey3+" ='"+replacevalue3+"',"+replacekey4+" ='"+replacevalue4+"',"+replacekey5+" ='"+replacevalue5+"' WHERE "+uuid+" ='"+id+"'";
	conauth.query(insal,function(err,result){
						if(err) throw err;
						else{
							return callback(result);
						}
					});
}

sendMail=function(id, subjectbody, messagebody,callback){

	

	find("id",id,function(data){

	console.log("trying to send email");
		var transporter = nodemailer.createTransport({
			//host: 'pod51009.outlook.com',
			//st:'aspmx.l.google.com',
			//port: 587,
			host:'smtp.gmail.com',
			port: 587,
			secure: false, 
			auth: {
				user: 'lmsdamin@tnce.in',
				pass: 'lmsadmin'
			}
		});
	
		var mailOptions = {
			from: 'lmsadmin@tnce.in',
			//to: data[0].username,
			to: data[0].username,
			subject: subjectbody,
			html:messagebody
		};

		console.log(mailOptions);
		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
			console.log("error in semding mail ++++");
			console.log(error);
			}
			else {
				console.log('Email sent: ' + info.response);
				return callback("email sent");
			}
		});
	});
}


sendMailejs=function(id, subjectbody, template,templatedata,callback){

	

	find("id",id,function(data){

		var messagebody=ejscommonRender(templatedata,template);
	
		var transporter = nodemailer.createTransport({
			//host: 'pod51009.outlook.com',
			//st:'aspmx.l.google.com',
			//port: 587,
			host:'smtp.gmail.com',
			port: 587,
			secure: false, 
			auth: {
				user: 'lmsdamin@tnce.in',
				pass: 'lmsadmin'
			}
		});
	
		var mailOptions = {
			from: 'lmsadmin@tnce.in',
			//to: data[0].username,
			to: data[0].username,
			subject: subjectbody,
			html:messagebody
		};

		console.log(mailOptions);
		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
			console.log("error in semding mail ++++");
			console.log(error);
			}
			else {
				console.log('Email sent: ' + info.response);
				return callback("email sent");
			}
		});
	});
}


module.exports.find = find;
module.exports.finda = finda;
module.exports.findmultiple = findmultiple;
module.exports.authenticate = authenticate;
module.exports.insert = insert;
module.exports.insertal = insertal;
module.exports.insertper = insertper;
module.exports.serverd = serverd;
module.exports.alter = alter;
module.exports.update = update;
module.exports.deleterow = deleterow;
module.exports.updatemany=updatemany;
module.exports.days_between=days_between;
module.exports.encrypt=encrypt;
module.exports.findall=findall;
module.exports.updateyearly=updateyearly;
module.exports.sendMail=sendMail;
module.exports.deleteuser=deleteuser;
module.exports.findclass=findclass;
module.exports.findidname=findidname;
module.exports.applycompensation=applycompensation;
module.exports.insertclass=insertclass;
module.exports.deletecommon=deletecommon;
module.exports.findreport=findreport;
module.exports.sendMailejs=sendMailejs;
//module.exports.leavesecond=leavesecond;