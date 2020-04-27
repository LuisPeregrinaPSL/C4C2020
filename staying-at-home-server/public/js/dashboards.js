import { DBConnection } from './DBConnection.js';

var db = new DBConnection();

function updateDashboard(name, type) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://173.193.122.97:31247/getUrl', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let url = xhr.responseText;
            let h1 = document.getElementById('not-av');
            let iframe = document.querySelector('iframe');

            if (!url || url === 'NA') {
                iframe.hidden = true;
                h1.hidden = false;
            } else {
                iframe.hidden = false;
                iframe.setAttribute('src', url);
                h1.hidden = true;
            }
        } else {
            alert(`There was an error making the request!\n${xhr.responseText}`);
        }
    };

    xhr.onerror = function () {
        alert(`There was an error making the request!\n${xhr.responseText}`);
    };
    xhr.send(JSON.stringify({ type, name }));
}

function createListElement(list, element, id, isActive) {
	/*
	<li class="nav-item">
	  <a class="nav-link active" href="javascript: void(0);">Text</a>
	</li>
	*/
    let li = document.createElement('li');
    var a = document.createElement('a');

    li.setAttribute('class', 'nav-item');
    a.setAttribute('class', `nav-link${isActive ? ' active' : ''}`);
    a.setAttribute('href', 'javascript: void(0);');
    a.setAttribute('id', id);
    a.textContent = element;
    a.addEventListener('click', () => {
        let activeElement = list.querySelector('a[class*=active]');
        activeElement.setAttribute('class', 'nav-link');
        a.setAttribute('class', 'nav-link active');
        updateDashboard(element, id.split('_')[0]);
    });

    li.appendChild(a);
    list.appendChild(li);
}

function addCountriesListener(countriesTab) {
    var list = document.getElementById('list-countries');
    countriesTab.addEventListener('click', () => {
        let activeList = document.querySelector('ul[style*="display: inline"]');
        activeList.style.display = 'none';
        list.style.display = 'inline-flex';
        list.querySelector('a[class*=active]').click();
    });
}

function createStatesList(list) {
    let countries = document.getElementById('list-countries');
    let countryID = countries.querySelector('a[class*=active]').id.split('_')[1];
    let states = db.getStates(countryID);

    while (list.firstChild) {
        list.removeChild(list.lastChild);
    }
    if (states) {
        createListElement(list, states[0], 'state_0', true);
        for (let i = 1; i < states.length; i++) {
            createListElement(list, states[i], `state_${i}`, false);
        }
    }
}

function addStatesListener(statesTab) {
    var list = document.getElementById('list-states');
    statesTab.addEventListener('click', () => {
        let activeList = document.querySelector('ul[style*="display: inline"]');
        activeList.style.display = 'none';
        createStatesList(list);
        list.style.display = 'inline-flex';
        list.querySelector('a[class*=active]').click();
    });
}

function createCitiesList(list) {
    let countries = document.getElementById('list-countries');
    let countryID = countries.querySelector('a[class*=active]').id.split('_')[1];
    let states = document.getElementById('list-states');
    let state = states.querySelector('a[class*=active]');

    while (list.firstChild) {
        list.removeChild(list.lastChild);
    }
    if (state) {
        let cities = db.getCities(countryID, state.textContent);
        if (cities) {
            createListElement(list, cities[0], 'city_0', true);
            for (let i = 1; i < cities.length; i++) {
                createListElement(list, cities[i], `city_${i}`, false);
            }
        }
    }
}

function addCitiesListener(citiesTab) {
    var list = document.getElementById('list-cities');

    citiesTab.addEventListener('click', () => {
        let activeList = document.querySelector('ul[style*="display: inline"]');
        activeList.style.display = 'none';
        createCitiesList(list);
        list.style.display = 'inline-flex';
        list.querySelector('a[class*=active]').click();
    });
}

function addSearchListener() {
    var searchField = document.getElementById('search-place');
    searchField.addEventListener('submit', (e) => {
        e.preventDefault();
        let places = document.querySelectorAll('ul[style*="display: inline"]>li');
        let searchValue = searchField.querySelector('input').value;
        for (let place of places) {
            if (place.textContent.toLowerCase().includes(searchValue.toLowerCase())) {
                if (place.style.display === 'none') {
                    place.style.display = 'inline-flex';
                }
            } else {
                place.style.display = 'none';
            }
        }
    });
}

async function main() {
    await db.innit();
    let list = document.getElementById('list-countries');
    let countries = db.getCountries();

    createListElement(list, countries[0], 'country_0', true);
    for (let i = 1; i < countries.length; i++) {
        createListElement(list, countries[i], `country_${i}`, false);
    }
    list.querySelector('a[class*=active]').click();
    createStatesList(document.getElementById('list-states'))

    let slider = document.getElementById('places-slider');
    let inputs = slider.querySelectorAll('input');
    addCountriesListener(inputs[0]);
    addStatesListener(inputs[1]);
    addCitiesListener(inputs[2]);
    addSearchListener();
}

main();