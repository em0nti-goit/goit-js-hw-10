const DOMAIN = 'https://restcountries.com';
const PATH = '/v3.1/name/';

export function fetchCountries(name) {
  const fields = [
    , 'name'
    , 'capital'
    , 'population'
    , 'flags'
    , 'languages'
  ];
  const params = fields.join();
  const url = `${DOMAIN}${PATH}${name}?fields=${params}`;

  return fetch(url);
}