let regionsArray
let citiesArray

fetch('https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json')
    .then(res => res.json())
    .then(json => {
        regionsArray = json[0].regions;
        console.log(regionsArray)
    for (let region of regionsArray){
        const countryOption = document.createElement('option');
        const countrySelect = document.getElementById('countrySelect');
    countryOption.innerHTML = region.name;
    countrySelect.appendChild(countryOption);
}

    document.querySelector('#countrySelect').addEventListener('change',(event) => {
        let optionRegion = event.target.value
        citySelect.length = 0
        regionsArray.forEach(reg => {
            if (reg.name === optionRegion){
                citiesArray = reg.cities
                getCityNames()
            }
        })
    })
})

function getCityNames(){
    for (let citiesName of citiesArray){
        let cityOption = document.createElement('option');
        let citySelect = document.getElementById('citySelect');
        cityOption.innerHTML = citiesName['name'];
        citySelect.appendChild(cityOption);
        removeNameOption()
    }
}

function removeNameOption(){
    document.querySelector('#countrySelect').addEventListener('click', function(){
        document.getElementById('nameOption').remove();
    })
}

document.querySelector('#citySelect').addEventListener('change', function(){
    let cityNam = this.value
    console.log(cityNam)
    let lat, lon;
    const currentDate = new Date();
    let dd = currentDate.getDate();
    (dd < 10) ? dd = '0' + dd : dd;
    let mm = currentDate.getMonth() + 1;
    (mm < 10) ? mm = '0' + mm : mm;
    let yyyy = currentDate.getFullYear();
    (yyyy < 10) ? yyyy = '0' + yyyy : yyyy;
    let namDate = dd + '.' + mm + '.' + yyyy
    async function getCitiByName(){
        const weekday = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        document.querySelector('.d1').innerHTML = weekday[currentDate.getDay()] + '(Now)';
        document.querySelector('.num1').innerHTML = namDate;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityNam}&exclude=hourly&appid=7c219a3a9d67598fdeca2282d88817c7`);
        const firstDay = await response.json();
        document.querySelector('.name1').textContent = cityNam;
        // document.querySelector('.txt1').innerHTML = firstDay.weather[0].description;
        document.querySelector('.clouds11').innerHTML = 'Cloudiness now: ' + firstDay.clouds.all + " %" ;
        document.querySelector('.humidity11').innerHTML = 'Humidity now: ' + firstDay.main.humidity + " %" ;
        // document.querySelector('.pressure1').innerHTML = `Pressure:<br/>` + firstDay.main.pressure + " mm Hg" ;
        // document.querySelector('.wind1').innerHTML = `Wind speed:<br/>` + firstDay.wind.speed + " km/h" ;

        lat = firstDay.coord.lat
        lon = firstDay.coord.lon
        getCityByCoord()
    }
    async function getCityByCoord(){
        const coordResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=7c219a3a9d67598fdeca2282d88817c7`);
        const coordCityData = await coordResponse.json();
        console.log(coordCityData)
        const weekday = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDate = new Date();
        let currentDay = currentDate.getDay()-1;

        for (let i = 1; i<=8;i++){
            let NextDay = i-1
            if(currentDay >= 6){
                currentDay = 0
            }else{
                currentDay += 1
            }
            let today = new Date()
            let tomorrow = new Date(today.getTime() + (i-1)*(24 * 60 * 60 * 1000));
            let dd = tomorrow.getDate();
            (dd < 10) ? dd = '0' + dd : dd;
            let mm = tomorrow.getMonth() + 1;
            (mm < 10) ? mm = '0' + mm : mm;
            let yyyy = tomorrow.getFullYear();
            (yyyy < 10) ? yyyy = '0' + yyyy : yyyy;
            let namDate = dd + '.' + mm + '.' + yyyy;
            document.querySelector(`.num${i}`).innerHTML = namDate;
            document.querySelector(`.txt${i}`).innerHTML = coordCityData.daily[i-1].weather[0].description;
            document.querySelector(`.d${i}`).innerHTML = weekday[currentDay];
            document.querySelector(`.humidity${i}`).innerHTML = 'Humidity: ' + coordCityData.daily[i-1].humidity + " %" ;
            document.querySelector(`.pressure${i}`).innerHTML = `Pressure:<br/>` + coordCityData.daily[i-1].pressure + " mm Hg" ;
            document.querySelector(`.tempNow`).innerHTML = 'Air temperature now: ' + Math.round(coordCityData.current.temp - 273) + '&deg;C';
            document.querySelector(`.tempFeel`).innerHTML = 'Air temperature Feel: ' +  Math.round(coordCityData.current.feels_like - 273) + '&deg;C';
            document.querySelector(`.tempMax`).innerHTML = 'Air temperature Max: ' +  Math.round(coordCityData.daily[i-1].temp.max - 269) + '&deg;C';
            document.querySelector(`.tempMin`).innerHTML = 'Air temperature Min: ' +  Math.round(coordCityData.daily[i-1].temp.min - 270) + '&deg;C';
            document.querySelector(`.temp${i}`).innerHTML = 'Air temperature: ' +  Math.round(coordCityData.daily[i-1].temp.eve - 274) + '&deg;C';
            document.querySelector(`.clouds${i}`).innerHTML = 'Cloudiness: ' + coordCityData.daily[i-1].clouds + " %" ;
            document.querySelector(`.wind${i}`).innerHTML = `Wind speed:<br/>` + coordCityData.daily[i-1].wind_speed + " km/h" ;
        }
    }
    getCitiByName();
})