express = require('express');
request = require('request');
path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

app = express();
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
}
}));


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended : true}));
app.use(express.static(path.join(__dirname,'views')));

app.get('/',function(req,res){

	

	res.render('weather');
});

app.post('/',function(req,res) {

	var city=req.body.inputname;

	url=`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=6778f194ddc99fad61ea265d511446aa`;


request(url,function(error,response,body){
		weather_json=JSON.parse(body);


if(error)
{
	throw error;
	res.render('weather');
	return;
}		

		var weather = 
		{
			city:city,
			temp:Math.round(weather_json.main.temp),
			description:weather_json.weather[0].description,
			humidity:weather_json.main.humidity,
			pressure:weather_json.main.pressure,
			icon:weather_json.weather[0].icon,
		};
		var weather_data= {weather:weather};
		res.render('weather2',weather_data)
	});


	;
});

app.listen(8000,function(){
	console.log('Server is runnning at port 8000...');
});