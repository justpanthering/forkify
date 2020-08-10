// Global app controller
import Search from './Models/Search';
import Recipe from './Models/Recipe';
import ShoppingList from './Models/ShoppingList';
import Likes from './Models/Likes';
import {elements, displayLoader, removeLoader} from './Views/base';
import * as searchView from './Views/searchView';
import * as recipeView from './Views/recipeView';
import * as shoppingListView from './Views/shoppingListView';
import * as likesView from './Views/likesView';

/**
 * Global State of the app
 * ~ Search Object
 * ~ Current Recipe object
 * ~ Shopping List Object
 * ~ Liked Recipes
 */
const state = {};

/**
 * ***********************************************************************************
 *                                SEARCH CONTROLLER
 * * *********************************************************************************
 */

// Search Module
const controlSearch = async () => {
  //1. Get search query from UI
  const query = searchView.getInput();

  if(query){
    //2. Create new Search object and add to state
    state.search = new Search(query);

    //3. Prepare UI for result - loading
    searchView.clearList();
    displayLoader(elements.searchResults);

    try{
      //4. Ajax call to the api for the recipe
      await state.search.getResults();

      //5. Render result on app
      removeLoader();
      searchView.renderResult(state.search.result);
    }catch(error){
      alert(`Unable to search query: ${query}`);
    }
  }
};

// EVENT LISTENERS
elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
  const btn = e.target.closest(`.btn-inline`);
  if(btn){
    searchView.clearList();
    const goToPage = parseInt(btn.dataset.goto);
    searchView.renderResult(state.search.result, goToPage);
  }
});

/**
 * ***********************************************************************************
 *                                RECIPE CONTROLLER
 * * *********************************************************************************
 */

// Recipe Module
const controlRecipe = async () => {
  //1. Get the ID
  const id = window.location.hash.replace('#', '');

  if(id){
    state.recipe = new Recipe(id);

    //2. Prepare the UI
    recipeView.clearRecipeDisplay();
    displayLoader(elements.recipeDisplay);

    if(state.search){
      //Highlight selected item
      searchView.highlightSelector(id);
    }

    try{
      //3. Get the recipe data from API
      await state.recipe.getRecipe();

      //4. Claculate time and servings
      state.recipe.calculateServings();
      state.recipe.calculateTime();

      //5. Parse Ingredients
      state.recipe.parseIngredients();

      //6. Render recipe
      removeLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    }catch(error){
      console.log(error);
      alert('Unable to fetch the recipe');
    }
  }
};

//EVENT LISTENERS
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['load', 'hashchange'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipeDisplay.addEventListener('click', e => {
  if(e.target.matches('.btn-decrease, .btn-decrease *') && state.recipe.servings>4){
    //Decrease servings
    state.recipe.updateServings('dec');
    recipeView.updateServingIngredients(state.recipe);
  }
  else if(e.target.matches('.btn-increase, .btn-increase *')){
    //Increase servings
    state.recipe.updateServings('inc');
    recipeView.updateServingIngredients(state.recipe);
  }
  else if(e.target.matches('.recipe__btn-add-to-list, .recipe__btn-add-to-list *')){ //Add to SHOPPING LIST
    controlList();
  }
  else if(e.target.matches('.recipe__love, .recipe__love *')){  //Toggle Like
    controlLikes();
  }
});

/**
 * ***********************************************************************************
 *                                SHOPPING LIST CONTROLLER
 * * *********************************************************************************
 */

const controlList = () => {
  //1. Add new list to state
  if(!state.list)
    state.list = new ShoppingList();

  //2. Add each ingredient to state.list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    //2. Display item in UI
    shoppingListView.renderItem(item);
  });
};

//EVENT LISTENERS
elements.shoppingListDisplay.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  //delete item
  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    //1. delete from state
    state.list.deleteItem(id);

    //2. delete from UI
    shoppingListView.deleteItem(id);
  }

  //update item count
  else if(e.target.matches('.shopping__count-value')){
    //1. get {id, count} from UI
    const val = e.targer.value;

    //2. update {id, count} in state
    state.list.updateCount(id, val);
  }
});

/**
 * ***********************************************************************************
 *                                LIKE CONTROLLER
 * * *********************************************************************************
 */

const controlLikes = () => {
  //1. Add to state if not already
  if(!state.likes)
    state.likes = new Likes();

  //2. Check if not already liked
  if(!state.likes.isLiked(state.recipe.id)){
    //1. Add like to state
    const like = state.likes.addLike(
      state.recipe.id,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    //2. Toggle like btn
    likesView.toggleLikeBtn(false);

    //3. Display in Likes list
    likesView.renderLike(like)
  }
  else{ //Remove the already liked
    //1. Remove like to state
    state.likes.deleteLike(state.recipe.id);

    //2. Toggle like btn
    likesView.toggleLikeBtn(true);

    //3. Display in Likes list
    likesView.deleteLike(state.recipe.id);
  }
  likesView.toggleLikesMenu(state.likes.getNumLikes());
};

//LOAD LIKES WHEN APP STARTS
window.addEventListener('load', e => {
  state.likes = new Likes();
  //1. Get from LS
  state.likes.getDataLS();
  //2. Toggle Like btn
  likesView.toggleLikesMenu(state.likes.getNumLikes());
  //3. Render like UI
  state.likes.likes.forEach(el => likesView.renderLike(el));

  likesView.toggleLikesMenu(state.likes.getNumLikes());
});

