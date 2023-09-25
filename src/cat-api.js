import axios from 'axios';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] =
  'live_FFsHLCETqvAJvu4EZhXO1CYzV5YpehEV2ePwZ4LDNbzuYJbUqs4eftbscwSuALkB';

const fetchBreeds = () => {
  return axios
    .get(`/breeds`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

const fetchCatByBreed = breedId => {
  return axios
    .get(`/images/search?breed_ids=${breedId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export { fetchBreeds, fetchCatByBreed };
