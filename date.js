var a=new Date();
var b=new Date();
console.log(a);
console.log(b);
if(a==b){
    console.log("1");
}
else{
    console.log("2");
}

var d = new Date();
console.log(d.getHours());
console.log(d.getMinutes());

console.log(new Date(2018, 1, 9));
console.log(a.getMonth());

var moment = require('moment');
var date = moment(a, 'DD/MM/YYYY');
console.log(date);
var train_date = date.format('YYYY-MM-DD');
console.log(train_date);
if(train_date==train_date){
    
}
else{
    console.log("2");
}
function alert(){
    console.log("start");
}
var dayInMilliseconds = 1000 * 60 * 60 * 24;
setInterval(alert(),dayInMilliseconds );
