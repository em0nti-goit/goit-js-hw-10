export function fetchCountries(name) {
  const fields = [
    , 'name'
    , 'capital'
    , 'population'
    , 'flags'
    , 'languages'
  ];
  const params = fields.join()
  const url = `https://restcountries.com/v3.1/name/${name}?fields=${params}`;

  return fetch(url);

}