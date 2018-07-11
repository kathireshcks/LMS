var schedule = require('node-schedule');
	
function main(){
	 
	var j = schedule.scheduleJob('42 * * * * *', function(){
	  console.log('The answer to life, the universe, and everything! server');
	});
	}
	main();
