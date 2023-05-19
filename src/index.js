import './css/styles.css';

import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';


const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.insertAdjacentHTML(
  'beforebegin',
  '<h1 class="hero-title">Country search</h1>'
);
document.body.setAttribute('class', 'container');

searchBox.addEventListener(
  'input',
  debounce(onEnteringInput, DEBOUNCE_DELAY)
);

function onEnteringInput({ target: { value } }) {
  if (value === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  if (!value.trim()) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    Notify.failure('The string cannot be empty');
    return;
  }
  if (value.length < 2) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    Notify.info('Add more than one symbol');
    return;
  }

  fetchCountries(value.trim()).then(onFetchSuccess).catch(onFetchError);
}

function onFetchSuccess(countries) {
  if (countries.length > 10) {
    Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  if (countries.length === 1) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    renderCountryCard(countries);
    return;
  }
  renderCountriesList(countries);
}

function onFetchError(error) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  if (error.message === '404') {
    Notify.failure('Oops, there is no country with that name');
  }
  console.log(error);
}

function renderCountriesList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
      <li class='country-item'>
        <img
          style="outline: 1px solid rgb(0 0 0 / 30%)"
          width="35"
          src='${flags?.svg}'
          alt=''>
        <p> ${name?.official}</p>
      </li>`;
    })
    .join('');
    countryInfo.innerHTML = '';
  countryList.innerHTML = markup;
}

function renderCountryCard(countries) {
    countryInfo.innerHTML = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
      <div class='country-info-item'>
        <div class='country-name'>
          <img style="outline: 1px solid rgb(0 0 0 / 30%)"
            width="55"
            src='${flags?.svg}'
            alt=''>
          <p> ${name?.official}</p>
        </div>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Languages</b>: ${Object.values(languages)}</p>
      </div>`;
    })
    .join('');
}