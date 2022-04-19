import modalCard from '../templates/modalCard.hbs';


export const getMarkupModal = (objectMovie, ref) => {
  const modalMarkup = modalCard(objectMovie);
  ref.insertAdjacentHTML('beforeend', modalMarkup);
};

 