import './styles.css';
import './slimselect.css';

import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('#breedSelect');
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

window.addEventListener('load', () => {
  showLoader();
  fetchBreeds()
    .then(breeds => {
      markupBreedsSelect(breeds);
      new SlimSelect({
        select: '#breedSelect',
        settings: {
          placeholderText: 'Choose a breed...',
        },
      });
      hideLoader();
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!',
        options
      );
      console.error('Error loading breeds:', error);
      hideLoader();
      catInfoDiv.innerHTML = '';
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
    fetchCatByBreed(selectedBreedId)
      .then(catData => {
        const breedName = catData[0].breeds[0].name;
        const description = catData[0].breeds[0].description;
        const temperament = catData[0].breeds[0].temperament;
        const imageUrl = catData[0].url;

        markupCatInfo(breedName, description, temperament, imageUrl);
        hideLoader();
      })
      .catch(error => {
        Notiflix.Notify.failure(
          'Oops! Something went wrong! Try reloading the page!',
          options
        );
        console.error('Error retrieving cat information:', error);
        hideLoader();
        catInfoDiv.innerHTML = '';
      });
  } else {
    catInfoDiv.innerHTML = '';
  }
});
