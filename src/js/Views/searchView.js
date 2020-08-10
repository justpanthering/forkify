import {elements} from './base';

export const getInput = () => elements.searchField.value;

export const clearList = () => {
  elements.searchResultList.innerHTML = '';
  elements.searchResultPages.innerHTML = '';
};

export const renderResult = (recipes, page = 1, resPerPage = 10) => {
  //Render Recepies
  const start = (page - 1) * resPerPage;
  const end = page*resPerPage;
  recipes.slice(start, end).forEach(recipe => {
    renderRecipe(recipe);
  });

  //Render page nav
  renderButtons(page, recipes.length, resPerPage);
};

export const highlightSelector = id => {

  //Unhighlight others
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(el => el.classList.remove('results__link--active'))

  //Highlight id
  document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

const renderRecipe = recipe => {
    const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if(title.length > limit){
    title.split(' ').reduce((acc, cur) => {
      if(acc + cur.length <= limit){
        newTitle.push(cur);
        return acc + cur.length;
      }
    }, 0);
    return `${newTitle.join(' ')}...`;
  }
  return title;
};

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults/resPerPage);

  let btnHTML;

  if(page == 1 && pages>1){
    //Only Next Page
    btnHTML = createPageBtn(page, 'next');
  }
  else if(page < pages){
    //Next and Previous Page
    btnHTML = `
    ${createPageBtn(page, 'prev')}
    ${createPageBtn(page, 'next')}
    `;
  }
  else{
    //Previous Page
    btnHTML = createPageBtn(page, 'prev');
  }

  //Add to doc html
  elements.searchResultPages.insertAdjacentHTML('afterbegin', btnHTML);
  
};

//type = prev, next
const createPageBtn = (page, type) =>
  `
                <button class="btn-inline results__btn--${type}" data-goto=${type == "prev" ? page-1 : page+1}>
                    <span>Page ${type == "prev" ? page-1 : page+1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type == "prev" ? "left" : "right"}"></use>
                    </svg>
                </button>
`;