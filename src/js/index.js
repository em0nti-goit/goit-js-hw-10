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
  const searchQuery = e.target.value.trim();
  while (searchQuery) {

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
          setCountryListMarkup();
        }
      })
      .catch(err => {
        console.error(err);
        Notify.failure("Oops, there is no country with that name");
      })
  }
}

function setCountryListMarkup(countries) {
  return countries.map().join(' ');
}

// fetchCountries('Sw')
//   .then(response => response.json())
//   .then(countries => {
//     countries.forEach(country => {
//       console.log(country.name.common);
//       console.log(country.capital.join());
//       console.log(country.population);
//       console.log(country.flags.svg);
//       console.log(Object.values(country.languages).join());
//     });
//   });