import '../css/styles.css';
import { fetchCountries } from "./fetchCountries";

const DEBOUNCE_DELAY = 300;

fetchCountries('Sw')
  .then(response => response.json())
  .then(countries => {
    countries.forEach(country => {
      console.log(country.name.common);
      console.log(country.capital.join());
      console.log(country.population);
      console.log(country.flags.svg);
      console.log(Object.values(country.languages).join());
    });
  });