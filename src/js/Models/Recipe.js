import axios from 'axios';

export default class Recipe{
  constructor(id){
    this.id = id;
  }

  async getRecipe(){
    try{
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
    this.title = res.data.recipe.title;
    this.author = res.data.recipe.publisher;
    this.img = res.data.recipe.image_url;
    this.url = res.data.recipe.source_url;
    this.ingredients = res.data.recipe.ingredients;
    }
    catch(error){
      alert('Something went wrong : (');
    }
  };

  calculateTime(){
    //Assumption: 15 minutes is required for every 3 ingredients
    const IngNo = this.ingredients.length;
    const periods = Math.ceil(IngNo / 3);
    this.time = periods * 15;
  }

  calculateServings(){
    this.servings = 4;
  }

  parseIngredients(){
    const unitsLong = ['tablespoons', 'tablespoons', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'ounces', 'ounce'];
    const unitsShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'cup', 'pound', 'oz', 'oz'];

    const newIngredients = this.ingredients.map(ing => {
      //1. Uniform Ingredient units
      let ingredient = ing.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      //2. Remove ()
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      //3. Parse each ingredient statement into: count, unit, ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(el => unitsShort.includes(el));

      let ingObj;

      if(unitIndex > -1){
        //There is a unit (and a number)
        const countArr = arrIng.slice(0, unitIndex);

        let count;
        if(countArr.length>1){
          count = eval(countArr.slice(0, unitIndex).join('+'));
        }
        else{
          count = eval(countArr[0].replace('-', '+'));
        }

        //To resolve error in api
        count = count ? count : 1;

        ingObj = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex+1).join(" ")
        };
      }
      else if(parseInt(arrIng[0], 10)){
        //There is no unit, but a number
        ingObj = {
          count: parseInt(arrIng[0], 10),
        unit: '',
        ingredient: arrIng.slice(1).join(' ')
        }
      }
      else if(unitIndex == -1){
        //There is no unit and no number
        ingObj = {
          count: 1,
          unit: '',
          ingredient
        };
      }

      //4. Return each ingredient as an object (count, unit, ingredient)
      return ingObj;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type){
    //Servings
    const newServings = type === 'dec' ? this.servings-4 : this.servings+4;

    //Ingredients
    this.ingredients.forEach(ing => {
      ing.count = (ing.count/this.servings) * newServings;
    });

    this.servings = newServings;
  }
}