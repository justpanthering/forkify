import uniqid from 'uniqid';

export default class ShoppingList {
  constructor(){
    this.list = [];
  }

  addItem(count, unit, ingredient){
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    }

    this.list.push(item);
    return item;
  }

  deleteItem(id){
    const listIndex = this.list.findIndex(el => el.id === id);
    this.list.splice(listIndex, 1);
  }

  updateCount(id, newCount){
    this.list.find(el => el.id === id).count = newCount;
  }
}