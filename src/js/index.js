import '../css/styles.css';
import { fetchCountries } from "./fetchCountries";
import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-card'),
}

// handler for input event with debounce
refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const searchQuery = e.target.value.trim();

  clearMarkup();

  if (searchQuery) {
    Loading.standard('Searching...', {
      backgroundColor: 'rgba(0,0,0,0.1)',
    });
    fetchCountries(searchQuery).then(handleResult).catch(handleError).finally(() => Loading.remove(500));
  }
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryCard.innerHTML = '';
}

function handleError(err) {
  console.error(err);
  Notify.failure("Oops, there is no country with that name");
  clearMarkup();
}

function handleResult(result) {
  if (result.length > 10) {
    Notify.info("Too many matches found. Please enter a more specific name.");
    return;
  }
  if (result.length > 2 && result.length <= 10) {
    updateListMarkup(result);
    return;
  }
  updateCardMarkup(result[0])
}

function prepareListItemMarkup(country) {
    return `<li class="country-list__item">
    <img class="country-list__img" src="${country.flags.svg}" width="24" height="16" alt="Flag of ${country.name.common}">
    <p class="country-list__text">${country.name.official}</p>
  </li>`;
}

function updateListMarkup(countries) {
  refs.countryList.innerHTML = countries.map(prepareListItemMarkup).join('');
}

function prepareCardMarkup(country) {
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

function updateCardMarkup(country) {
  refs.countryCard.innerHTML = prepareCardMarkup(country);
}