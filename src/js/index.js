import '../css/styles.css';
import { fetchCountries } from "./fetchCountries";
import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-card'),
}

// handler for input event with debounce
refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  refs.countryCard.innerHTML = '';
  refs.countryList.innerHTML = '';

  const searchQuery = e.target.value.trim();

  if (searchQuery) {
    fetchCountries(searchQuery)
      .then(res => {
        if (!res.ok) throw new Error(`Response status: ${res.status}`);
        return res.json();
      })
      .then(result => {
        if (result.length > 10) {
          Notify.info("Too many matches found. Please enter a more specific name.");
          return;
        }
        if (result.length > 2 && result.length <= 10) {
          refs.countryList.innerHTML = prepareCountryListMarkup(result);
          return;
        }
        refs.countryCard.innerHTML = prepareCountryCardMarkup(result);
      })
      .catch(err => {
        console.error(err);
        Notify.failure("Oops, there is no country with that name");
      })
  }
}

function prepareCountryListMarkup(countries) {
  return countries.map(country => {
    return `<li class="country-list__item">
    <img class="country-list__img" src="${country.flags.svg}" width="24" height="16" alt="Flag of ${country.name.official}">
    <p class="country-list__text">${country.name.common}</p>
  </li>`;
  }).join(' ');
}

function prepareCountryCardMarkup([country]) {
  return `<header class="country-card__header">
    <img class="country-card__img" src="${country.flags.svg}" width="33" height="22" alt="Flag of ${country.name.official}">
    <h2 class="country-card__title">${country.name.common}</h2>
  </header>
  <dl class="country-card__info info">
    <dt class="info__term">Capital</dt>
    <dd class="info__desc">${country.capital.join()}</dd><br>
    <dt class="info__term">Population</dt>
    <dd class="info__desc">${country.population}</dd><br>
    <dt class="info__term">Languages</dt>
    <dd class="info__desc">${Object.values(country.languages).join(', ')}</dd><br>
  </dl>`;
}
