export const elements = {
  searchForm: document.querySelector('.search'),
  searchResults: document.querySelector('.results'),
  searchField: document.querySelector('.search__field'),
  searchResultList: document.querySelector('.results__list'),
  searchResultPages: document.querySelector('.results__pages'),
  recipeDisplay: document.querySelector('.recipe'),
  shoppingListDisplay: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes'),
  likesList: document.querySelector('.likes__list')
};

export const htmlStrings = {
  loader: 'loader'
};

export const displayLoader = parent => {
  const loader = `
  <div class="${htmlStrings.loader}">
    <svg>
      <use href="img/icons.svg#icon-cw"></use>
    </svg>
  </div>
  `;

  parent.insertAdjacentHTML('afterbegin', loader);
};

export const removeLoader = () => {
  const loader = document.querySelector(`.${htmlStrings.loader}`);
  if(loader)
    loader.parentElement.removeChild(loader);
};