require('dotenv').config();
const express = require('express');
const https = require('https');
const ejs = require('ejs');
const { type } = require('os');

const app = express();
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// GET THE DATE START
var d = new Date();
var day;
var date = d.getDate();
var month;
var year = d.getFullYear();

switch (d.getDay()) {
    case 0: day = "Sunday";
        break;
    case 1: day = "Monday";
        break;
    case 2:  day = "Tuesday";
        break;
    case 3: day = "Wednesday";
        break;
    case 4: day = "Thursday";
        break;
    case 5: day = "Friday";
        break;
    case 6: day = "Saturday";
        break;
}

switch (d.getMonth()) {
    case 1: month = "January";
        break;
    case 2: month = "February";
        break;
    case 3: month = "March";
        break;
    case 4: month = "April";
        break;
    case 5: month = "May";
        break;
    case 6: month = "June"; 
        break;
    case 7: month = "July";
        break;
    case 8: month = "August";
        break;
    case 9: month = "September";
        break;
    case 10: month = "October";
        break;
    case 11: month = "November";
        break;
    case 12: month = "December";
        break;
}
var fullDate = day + ', ' + date + ' ' + month + ' ' + year;
console.log(fullDate);
// GET THE DATE END

var values = {
    today: fullDate,
    nameCity: null,
    countryCode: null,
    temperature: null,
    day_type: null,
    min_temp: null,
    max_temp: null,
    descrip: null,
    image : null,
    humid: null,
    press: null,
    vidible: null,
    wind_type: null,
    cod: null
};

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index', values);
});

app.post('/', function (req, res) {
    const cityName = req.body.city;
    console.log(cityName);
    const api = process.env.API_KEY

    const unit = 'metric';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+api+"&units="+unit;

    https.get(url, function (response) {
        console.log(response.cod);

        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);

            console.log(weatherData.cod);

            if (weatherData.cod === '404') {
                res.render('error', {today: fullDate});
            } else {

                console.log(new Date(weatherData.dt*1000+(weatherData.timezone*1000)));


                const country = weatherData.sys.country;
                const temp = weatherData.main.temp;
                const minTemp = weatherData.main.temp_min;
                const maxTemp = weatherData.main.temp_max;
                const description = weatherData.weather[0].description;
                const img = weatherData.weather[0].icon;
                const imgUrl = "http://openweathermap.org/img/wn/" + img + "@2x.png";
                const humidity = weatherData.main.humidity;
                const pressure = weatherData.main.pressure;
                const visibility = weatherData.visibility;
                const wind = weatherData.wind.speed;

                var day_value = null;
                if (weatherData.dt > weatherData.sys.sunrise && weatherData.dt < weatherData.sys.sunset) {
                    day_value = 'Sun is up 🌞'
                } else {
                    day_value = 'Night Time 🌚'
                }

                const city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
                const desc = description.charAt(0).toUpperCase() + description.slice(1);

                values = {
                    today: fullDate,
                    nameCity: city,
                    countryCode: country,
                    temperature: temp,
                    day_type: day_value,
                    min_temp: minTemp,
                    max_temp: maxTemp,
                    descrip: desc,
                    image : imgUrl,
                    humid: humidity,
                    press: pressure,
                    visible: visibility,
                    wind_type: wind,
                    cod: ''
                };

                res.render('details', values);
                console.log(values);
            }
        })

    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Server started');
})