document.addEventListener('DOMContentLoaded', () => {
    let elementsHaveBeenCreated = false;
    let toggleCF = 'celcius';
    const container = document.querySelector('.grid-container');
    let city;
    let hourlyDetails = [];
    let selectedIcon1;
    let selectedIcon2;
    let selectedIcon3;
    let eventListAdded = false;
    let detButtonEventListAdded = false;
    // function for api request
    async function get_position() {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      }
   // function for getting data   
    async function get_data(){
        const position = await get_position();
        const responce = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=97f57c9479984c50bef141107230405&q=${position.coords.latitude},${position.coords.longitude}&days=3`)
        const data = await responce.json()
        city = data['location']['name']
        return data
    }
    // function for getting day
    function find_day(dat){
        const date = new Date(dat);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday', 'Friday', 'Saturday']
        return daysOfWeek[date.getDay()];
    }
    // function for displaying
    function display5(info){
        const data = info;
        const hourlyData = data['forecast']['forecastday'];
        console.log(hourlyData)
        const h1 = document.querySelector('#title');
        h1.innerHTML = city + ': weather reports based on ' + '<a href="https://www.weatherapi.com/" title="Free Weather API"><img src="https://cdn.weatherapi.com/v4/images/weatherapi_logo.png" alt="Weather data by WeatherAPI.com" border="0"></a>'
        hourlyData.forEach((el, indexOfDay) => {
            // for button for expanding details
            const button = document.querySelector(`.button.${fromNumToW(indexOfDay)}`)
            const span = button.querySelector('span')
            const imgarrow = button.querySelector('img')
            imgarrow.src = 'arrow.png'
            imgarrow.alt = 'arrow for expanding details'
            imgarrow.width = '24'
            span.innerText = 'hourly details'
            
            // for left column creating two inner columns
            const leftColumn = document.querySelector(`.leftC.${fromNumToW(indexOfDay)}`);
            const leftDiv = leftColumn.querySelector('.leftDiv');
            const rightDiv = leftColumn.querySelector('.rightDiv');
            leftDiv.querySelectorAll('div').forEach((x, index) => {
                switch (index) {
                    case 0:
                        if (indexOfDay === 0){
                            x.innerHTML = 'Today'
                            break;
                        }
                        else {
                            x.innerHTML = find_day(el['date']);
                            break;
                        }
                    case 1:
                        x.innerHTML = el['day']['condition']['text'];
                        break;
                }
            })
            // for right column for slideshow
            const slideContainer = rightDiv.querySelector('div')
            const slide1 = slideContainer.querySelector('div')
            const slide2 = slideContainer.querySelectorAll('div.slide')[1]
            let sunrise, sunset, moonRise, moonSet, moonPhase, moonIll, max, min, maxWind, totalPrec;
            let sunriseVal, sunsetVal, moonRiseVal, moonSetVal, moonPhaseVal, moonIllVal, maxVal, minVal, maxWindVal, totalPrecVal;
            slide1.querySelectorAll('div').forEach((item, counter) => {
                switch (counter) {
                    case 0:
                        sunrise = item
                        break;
                    case 1:
                        sunriseVal = item
                        break;
                    case 2:
                        sunset = item
                        break;
                    case 3:
                        sunsetVal = item
                        break;
                    case 4:
                        moonRise = item
                    case 5:
                        moonRiseVal= item
                        break;
                    case 6:
                        moonSet = item
                        break;
                    case 7:
                        moonSetVal = item
                        break;
                    case 8:
                        moonPhase = item
                        break;
                    case 9:
                        moonPhaseVal = item
                        break;
                    case 10:
                        moonIll = item
                        break;
                    case 11:
                        moonIllVal = item
                        break;
                }
            })
            sunrise.innerText = 'Sunrise'
            sunriseVal.innerText = el['astro']['sunrise']
            sunset.innerText = 'Sunset'
            sunsetVal.innerText = el['astro']['sunset']
            moonRise.innerText = 'Moonrise'
            moonRiseVal.innerText = el['astro']['moonrise']
            moonSet.innerText = 'Moonset'
            moonSetVal.innerText = el['astro']['moonset']
            moonPhase.innerText = 'Moon phase'
            moonPhaseVal.innerText = el['astro']['moon_phase']
            moonIll.innerText = 'Illumination'
            moonIllVal.innerText = el['astro']['moon_illumination'] + '%'
        
            slide2.querySelectorAll('div').forEach((item, counter) => {
                switch (counter) {
                    case 0:
                        max = item
                        break;
                    case 1:
                        maxVal = item
                        break;
                    case 2:
                        min = item
                        break;
                    case 3:
                        minVal = item
                        break;
                    case 4:
                        maxWind = item
                        break;
                    case 5:
                        maxWindVal = item
                        break;
                    case 6:
                        totalPrec = item
                        break;
                    case 7:
                        totalPrecVal = item
                        break;
                }
            })
            max.innerText = 'Max temp'
            maxVal.innerText = displayCF(el['day']['maxtemp_c'])
            min.innerText = 'Min temp'
            minVal.innerText = displayCF(el['day']['mintemp_c'])
            maxWind.innerText = 'Max wind speed'
            maxWindVal.innerText = displayCF(el['day']['maxwind_kph'], 'speed')
            totalPrec.innerText = 'total daily precipitation'
            totalPrecVal.innerText = displayCF(el['day']['totalprecip_mm'], 'distance')

            // for more info            
            // after ajax update this is not needed the displaying is done on main

            // for right col for hourly elements
            const rightColumn = document.querySelector(`.rightC.${fromNumToW(indexOfDay)}`);
            rightColumn.querySelectorAll('.hour-element').forEach((element, indexOfHour) => {
                const a = el['hour'][indexOfHour * 2]['time'].slice(-5) // multiply * 2 because we want 12 hours (so we have 12 elements) for 24 hours of data
                const b = `<img src="https:${el['hour'][indexOfHour * 2]['condition']['icon']}" width=64px alt="weather icon"/>`
                const c = '<h3 class="a">' + displayCF(el['hour'][indexOfHour * 2]['temp_c']) + '</h3>'
                const inner = element.querySelector('div')
                element.querySelector('h3').innerHTML = a;
                inner.innerHTML = b + c
                element.appendChild(inner)

            })
    
        })
    }
    
    async function main(){
        let info;        
        try {
            info = await get_data();
        }
        catch (er){
            console.log('Error:' + er)
        }
        
        if (info != undefined){
            elementsHaveBeenCreated = true;
            createElements();
            display5(info);
            info['forecast']['forecastday'].forEach(el => {
                hourlyDetails.push(el)
            })
            highlight();
        }
    }

    function fromNumToW(num){
        const words = ['zero', 'one', 'two', 'three', 'four', 'five']
        return words[num]
    }

    function writeCol3(day, hour){
        const col3 = document.querySelector(`#${fromNumToW(day)}`)
        const Day = hourlyDetails[day]['hour'][hour]
        const cond = col3.querySelector('[name=cond]')
        const hum = col3.querySelector('[name=humidity]')
        const wind = col3.querySelector('[name=wind]')
        const cloud = col3.querySelector('[name=cloud]')
        const temp = col3.querySelector('[name=temp]')
        const feels = col3.querySelector('[name=feelsLike]')
        const chance = col3.querySelector('[name=chanceOfRain]')
        const vis = col3.querySelector('[name=visibility]')
        if (toggleCF == 'celcius'){
            cond.querySelector('.val').innerHTML = Day['condition']['text']
            hum.querySelector('.val').innerHTML = `${Day['humidity']}%`
            wind.querySelector('.val').innerHTML = `${Day['wind_kph']} km/h`
            cloud.querySelector('.val').innerHTML = `${Day['cloud']}%`
            temp.querySelector('.val').innerHTML = `${Day['temp_c']}` + String.fromCharCode(176)
            feels.querySelector('.val').innerHTML = `${Day['feelslike_c']}` + String.fromCharCode(176)
            chance.querySelector('.val').innerHTML = `${Day['chance_of_rain']}%`
            vis.querySelector('.val').innerHTML = `${Day['vis_km']} km`
        }
        else {
            cond.querySelector('.val').innerHTML = Day['condition']['text']
            hum.querySelector('.val').innerHTML = `${Day['humidity']}%`
            wind.querySelector('.val').innerHTML = `${Day['wind_mph']} mph`
            cloud.querySelector('.val').innerHTML = `${Day['cloud']}%`
            temp.querySelector('.val').innerHTML = `${Day['temp_f']}` + String.fromCharCode(176)
            feels.querySelector('.val').innerHTML = `${Day['feelslike_f']}` + String.fromCharCode(176)
            chance.querySelector('.val').innerHTML = `${Day['chance_of_rain']}%`
            vis.querySelector('.val').innerHTML = `${Day['vis_miles']} miles`
        }
    }

    const searchResult = document.querySelector('.search-result')
    document.querySelector('.search-input').addEventListener('keyup', function(e) {
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=97f57c9479984c50bef141107230405&q=${e.target.value}`)
        .then(responce => {
            if (responce.ok){
                return responce.json()
            }
            else {
                throw new Error;
            }
        })
        .then(re => {
            const city = re.location.name;
            const country = re.location.country;
            searchResult.innerText = `${city}, ${country}`
        })
        .catch(() => {
            searchResult.innerText = ''
        })
    })

    searchResult.addEventListener('click', async function () {
        const responce = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=97f57c9479984c50bef141107230405&q=${this.innerHTML.split(',')[0]}&days=5`)
        const data = await responce.json()
        city = data['location']['name']
        if (elementsHaveBeenCreated === false){
            createElements();
            elementsHaveBeenCreated = true
        }
        display5(data);
        hourlyDetails = [];
        data['forecast']['forecastday'].forEach((d) => hourlyDetails.push(d))
        highlight();
    })

    function createElements(numOfDays=3){
        for (let indexOfDay = 0;indexOfDay < numOfDays; indexOfDay++) {
            // for button for expanding details
            const button = document.createElement('div')
            button.classList.add('button', fromNumToW(indexOfDay))
            const span = document.createElement('span')
            const imgarrow = document.createElement('img')
            imgarrow.classList.add('arrow')
            button.appendChild(span)
            button.appendChild(imgarrow)
            
            // for left column creating two inner columns
            const leftColumn = document.createElement('div');
            leftColumn.classList.add('leftC', fromNumToW(indexOfDay));
            const leftDiv = document.createElement('div');
            leftDiv.className = 'leftDiv';
            const rightDiv = document.createElement('div');
            rightDiv.className = 'rightDiv';
            // for leftC rightDiv slideshow
            const slideshow = document.createElement('div')
            slideshow.className = "slide-container"
            const slide1 = document.createElement('div')
            const slide2 = document.createElement('div')
            slide1.className = "slide"
            slide2.className = "slide"
            const prev = document.createElement('a')
            const next = document.createElement('a')
            prev.classList.add('prev-next')
            prev.id = 'prev'
            next.classList.add('prev-next')
            next.id = 'next'
            prev.innerHTML = '&#10094;'
            next.innerHTML = '&#10095;'
            prev.onclick = function (){
                prevSlide(slideshow)
            };
            next.onclick = function(){
                nextSlide(slideshow)
            };
            // slide1 creating two divs for each grid row
            // apending elements and creating two inner divs
            ['sunrise', 'sunset', 'moonRise', 'moonSet', 'moonPhase', 'moonIll']
            .forEach((() => {
                const name = document.createElement('div')
                const value = document.createElement('div')
                name.style.color = 'rgb(203, 203, 203)'
                slide1.appendChild(name)
                slide1.appendChild(value)
            }));

            // slide2
            // apending elements and creating two inner divs
            ['max', 'min', 'totalPerc', 'maxWind'].forEach(() => {
                const name = document.createElement('div')
                name.style.color = 'rgb(200, 200, 200)'
                const value = document.createElement('div')
                slide2.appendChild(name)
                slide2.appendChild(value)
            });

            slideshow.appendChild(slide1)
            slideshow.appendChild(slide2)
            rightDiv.appendChild(slideshow)
            rightDiv.appendChild(prev)
            rightDiv.appendChild(next)

            //for leftC leftDiv
            const condition = document.createElement('div');
            const day = document.createElement('div');
            day.style.fontSize = '30px';
            leftDiv.appendChild(day);
            leftDiv.appendChild(condition);

            leftColumn.appendChild(leftDiv);
            leftColumn.appendChild(rightDiv);

            // for more info 
            const details = document.createElement('div')
            details.classList.add('details', 'first', 'hide')
            details.id = fromNumToW(indexOfDay)
            const cond = document.createElement('div');
            const wind = document.createElement('div');
            const humidity = document.createElement('div');
            const cloud = document.createElement('div');
            const feelsLike = document.createElement('div');
            const chanceOfRain = document.createElement('div');
            const visibility = document.createElement('div');
            const temp = document.createElement('div');

            cond.className = 'moreInfo';
            wind.className = 'moreInfo';
            humidity.className = 'moreInfo';
            cloud.className = 'moreInfo';
            feelsLike.className = 'moreInfo';
            chanceOfRain.className = 'moreInfo';
            visibility.className = 'moreInfo';
            temp.className = 'moreInfo';

            cond.setAttribute('name', 'cond')
            wind.setAttribute('name', 'wind')
            humidity.setAttribute('name', 'humidity')
            cloud.setAttribute('name', 'cloud')
            feelsLike.setAttribute('name', 'feelsLike')
            chanceOfRain.setAttribute('name', 'chanceOfRain')
            visibility.setAttribute('name', 'visibility')
            temp.setAttribute('name', 'temp');

            [cond, wind, humidity, cloud, feelsLike, chanceOfRain, visibility, temp].forEach((elem, ind) => {
                const name = document.createElement('div')
                name.className = 'name'
                const val = document.createElement('div')
                val.className = 'val'
                elem.appendChild(name)
                elem.appendChild(val)
                switch (ind) {
                    case 0:
                        name.innerHTML = 'Condition'
                        break;
                    case 1:
                        name.innerHTML = 'Wind Speed'
                        break;
                    case 2:
                        name.innerHTML = 'Humidity'
                        break;
                    case 3:
                        name.innerHTML = 'Cloud Coverage'
                        break;
                    case 4:
                        name.innerHTML = 'Feels Like'
                        break;
                    case 5:
                        name.innerHTML = 'Chance of Rain'
                        break;
                    case 6:
                        name.innerHTML = 'Visibility'
                        break;
                    case 7:
                        name.innerHTML = 'Temperature'
                        break;
                }
            })

            details.appendChild(temp)
            details.appendChild(feelsLike)
            details.appendChild(cond)
            details.appendChild(humidity)
            details.appendChild(cloud)
            details.appendChild(chanceOfRain)
            details.appendChild(visibility)
            details.appendChild(wind)

            // for right col for hourly elements
            const rightColumn = document.createElement('div');
            rightColumn.classList.add('rightC', fromNumToW(indexOfDay)) 
            for (let indexOfHour = 0;indexOfHour < 24; indexOfHour++){
                if (indexOfHour % 2 == 0){
                    const outerDiv = document.createElement('div')
                    outerDiv.className = 'hour-element'
                    outerDiv.id = `${indexOfDay}-${indexOfHour}`;
                    //outerDiv.style.display = 'inline-block';
                    const h5 = document.createElement('h3')
                    const innerDiv = document.createElement('div')
                    innerDiv.className = 'icon-temp';
                    innerDiv.style.display = 'inline-block';
                    outerDiv.appendChild(h5)
                    outerDiv.appendChild(innerDiv)
                    rightColumn.appendChild(outerDiv)
                }   
            }
            container.appendChild(leftColumn)
            container.appendChild(rightColumn)
            container.appendChild(details)
            container.appendChild(button)
        }

        // the listener is in createlemnts so that the element is created before adding a listener
        // for drop down
        if (detButtonEventListAdded === false){
            document.querySelectorAll('.button').forEach(el => {
                el.addEventListener('click', () => {
                    const det = document.querySelector(`#${el.className.split(' ')[1]}`)
                    det.classList.toggle('visible')
                    det.classList.toggle('hide')
                    det.classList.remove('first')
                    const ar = el.querySelector(`.arrow`)
                    ar.classList.toggle('arrow-effect')
                })
            })
            detButtonEventListAdded = true
        }
    }

    main();

    
    function nextSlide(slideContainer){
        slideContainer.scrollLeft += 300
    }

    function prevSlide(slideContainer){
        slideContainer.scrollLeft -= 300
    }

    function highlight(){
        // for hourly and details(col3)
        document.querySelectorAll('.hour-element').forEach((el, ind) => {
            if (eventListAdded == false) {
                el.addEventListener('click', () => {
                    let prevSelectedIcon;
                    if (ind < 12){
                        prevSelectedIcon = selectedIcon1
                        selectedIcon1 = el.querySelector('.icon-temp');
                    }
                    else if(ind >= 12 && ind <24){
                        prevSelectedIcon = selectedIcon2
                        selectedIcon2 = el.querySelector('.icon-temp');
                    }
                    else {
                        prevSelectedIcon = selectedIcon3
                        selectedIcon3 = el.querySelector('.icon-temp');
                    }
                    if (prevSelectedIcon != undefined){
                        prevSelectedIcon.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                    }
                    el.querySelector('.icon-temp').style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
                    const [day, hour] = el.id.split('-')
                    writeCol3(day, hour)
                    
                })
            }
            // to have the appropriate icon-temp highlighted and coresponding col3 info
            const time = new Date();
            const timeHour = time.getHours();
            if ((el.querySelector('h3').innerHTML.slice(0, 2) == timeHour || 
                 el.querySelector('h3').innerHTML.slice(0, 2) == timeHour - 1)) {
                    if (ind < 12){
                        // this block is executed either when elements have first been created or when a new city is searched
                        // the if != undefined is so that if a new city is searched and an hour-icon is highlighted this code will 
                        // undo the highlithing and re added to the current hour
                        if (selectedIcon1 != undefined){
                            selectedIcon1.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }
                        selectedIcon1 = el.querySelector('.icon-temp');
                        selectedIcon1.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
                    }                
                    else if (ind >= 12 && ind < 24) {
                        if (selectedIcon2 != undefined){
                            selectedIcon2.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }
                        selectedIcon2 = el.querySelector('.icon-temp')
                        selectedIcon2.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
                    }
                    else {
                        if (selectedIcon3 != undefined){
                            selectedIcon3.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }
                        selectedIcon3 = el.querySelector('.icon-temp')
                        selectedIcon3.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
                    }
                const [day, hour] = el.id.split('-')
                writeCol3(day, hour)
            }
        })
        eventListAdded = true
    }

    // this function must only be after display
    function setCelFahr(){

        document.querySelectorAll('.hour-element').forEach((el) => {
            let iconTemp = el.querySelector('.icon-temp')
            let h3 = iconTemp.querySelector('h3')
            let temp = h3.innerText.slice(0, -1)
            temp = Number(temp)
            if (toggleCF == 'celcius') {
                temp = ((temp * 9/5) + 32).toFixed(1)
            }
            else if (toggleCF == 'fahr') {
                temp = ((temp - 32) * 5/9).toFixed(1)
            }
            h3.innerText = temp + String.fromCharCode(176)
        })

        document.querySelectorAll('.slide').forEach((el, ind) => {
            if (ind % 2 != 0) {// we only need to change the second slide
                el.querySelectorAll('div').forEach((elem, index) => {
                    if (index == 1 || index == 3) {
                        if (toggleCF == 'celcius') {
                            elem.innerText = ((Number(elem.innerText.slice(0, -1)) * 9/5) + 32).toFixed(1) + String.fromCharCode(176) 
                        }
                        else {
                            elem.innerText = ((Number(elem.innerText.slice(0, -1)) - 32) * 5/9).toFixed(1) + String.fromCharCode(176)
                        }
                    }
                    else if (index == 5) {
                        if (toggleCF == 'celcius') {
                            elem.innerText = (Number(elem.innerText.slice(0, -3)) / 1.6).toFixed(1) + 'mph'
                        }
                        else {
                            elem.innerText = (Number(elem.innerText.slice(0, -3)) * 1.6).toFixed(1) + 'kph'
                        }
                    }
                    else if (index == 7) {
                        if (toggleCF == 'celcius') {
                            elem.innerText = (Number(elem.innerText.slice(0, -2)) / 25.4).toFixed(1) + 'inch'
                        }
                        else {
                            elem.innerText = (Number(elem.innerText.slice(0, -4)) * 25.4).toFixed(1) + 'mm'
                        }
                    }
                })
            }
        })

        document.querySelectorAll('.details').forEach((el) => {
            el.querySelectorAll('.moreInfo').forEach((elem, ind) => {
                const div2 = elem.querySelector('.val')
                switch (ind) {
                    case 0:
                        if (toggleCF == 'celcius'){
                            div2.innerHTML = (Number(div2.innerHTML.slice(0, -1)) * 9/5 + 32).toFixed(1) + String.fromCharCode(176) 
                        }
                        else {
                            div2.innerHTML = ((Number(div2.innerText.slice(0, -1)) - 32) * 5/9).toFixed(1) + String.fromCharCode(176)
                        }
                        break;
                    case 1:
                        if (toggleCF == 'celcius'){
                            div2.innerHTML = (Number(div2.innerHTML.slice(0, -1)) * 9/5 + 32).toFixed(1) + String.fromCharCode(176) 
                        }
                        else {
                            div2.innerHTML = ((Number(div2.innerText.slice(0, -1)) - 32) * 5/9).toFixed(1) + String.fromCharCode(176)
                        }
                        break;
                    case 6:
                        if (toggleCF == 'celcius') {
                            div2.innerHTML = (Number(div2.innerHTML.slice(0, -3)) / 1.6).toFixed(1) + ' miles'
                        }
                        else {
                            div2.innerHTML = (Number(div2.innerHTML.slice(0, -6)) * 1.6).toFixed(1) + ' km'
                        }
                        break;
                    case 7:
                        if (toggleCF == 'celcius') {
                            div2.innerHTML = (Number(div2.innerHTML.slice(0, -5)) / 1.6).toFixed(1) + ' mph'
                        }
                        else {
                            div2.innerHTML = (Number(div2.innerHTML.slice(0, -4)) * 1.6).toFixed(1) + ' km/h'
                        }
                        break;
                }
            })
        })
        
        if (toggleCF == 'celcius') {
            toggleCF = 'fahr'
        }
        else {
            toggleCF = 'celcius'
        }
    }

    document.querySelector('.toggle-input').addEventListener('click', () => {
        const circle = document.querySelector('.toggle-circle')
        if (toggleCF == 'fahr') {
            circle.innerText = String.fromCharCode(176) + 'C'
        }
        else {
            circle.innerText = String.fromCharCode(176) + 'F'
        }
        setCelFahr();
    })

    // for the dislay5 to display according to toggleCF
    function displayCF(val, type=null){
        if (type == null) {
            if (toggleCF == 'celcius') {
                return val + String.fromCharCode(176)
            }
            else {
                return ((Number(val) * 9/5) + 32).toFixed(1) + String.fromCharCode(176)
            }
        }
        else if (type == 'speed') {
            if (toggleCF == 'celcius') {
                return val + 'kph'
            }
            else {
                return (Number(val) / 1.6).toFixed(1) + 'mph'
            }
        }
        else if (type == 'distance') {
            if (toggleCF == 'celcius') {
                return val + 'mm'
            }
            else {
                return (Number(val) / 25.4).toFixed(1) + 'inch'
            }
        }
    }
})
