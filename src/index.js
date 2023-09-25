import './styles.css';

import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('#breedSelect');
// const breedSelect = document.querySelector('.breed-select');
const catInfoDiv = document.querySelector('div.cat-info');
const loader = document.querySelector('.loader');

const options = {
  position: 'center-top',
  borderRadius: '20px',
  cssAnimationStyle: 'from-top',
};

const markupBreedsSelect = breeds => {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.text = breed.name;
    breedSelect.appendChild(option);
  });
};

const showLoader = () => {
  loader.classList.remove('is-hidden');
};

const hideLoader = () => {
  loader.classList.add('is-hidden');
};

const showSelect = () => {
  breedSelect.classList.remove('is-hidden');
};

const hideSelect = () => {
  breedSelect.classList.add('is-hidden');
};

window.addEventListener('load', () => {
  showLoader();
  hideSelect();
  fetchBreeds()
    .then(breeds => {
      markupBreedsSelect(breeds);
      showSelect();
      hideLoader();
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!',
        options
      );
      console.error('Error loading breeds:', error);
      hideLoader();
      hideSelect();
    });
});

const markupCatInfo = (breedName, description, temperament, imageUrl) => {
  catInfoDiv.innerHTML = `
    <img class="cat-img" src="${imageUrl}" alt="${breedName}">
    <div class="cat-info-wrapper">
    <h1 class="cat-title">${breedName}</h1>
    <p class="cat-text">${description}</p>
    <p class="cat-text"><span class="cat-span">Temperament:</span> ${temperament}</p>
    </div>
    `;
};

breedSelect.addEventListener('change', () => {
  const selectedBreedId = breedSelect.value;

  if (selectedBreedId) {
    showLoader();
    hideSelect();
    fetchCatByBreed(selectedBreedId)
      .then(catData => {
        const breedName = catData[0].breeds[0].name;
        const description = catData[0].breeds[0].description;
        const temperament = catData[0].breeds[0].temperament;
        const imageUrl = catData[0].url;

        markupCatInfo(breedName, description, temperament, imageUrl);
        hideLoader();
        showSelect();
      })
      .catch(error => {
        Notiflix.Notify.failure(
          'Oops! Something went wrong! Try reloading the page!',
          options
        );
        console.error('Error retrieving cat information:', error);
        hideLoader();
        hideSelect();
      });
  } else {
    catInfoDiv.innerHTML = '';
  }
});
