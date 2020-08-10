export default class Likes{
  constructor(){
    this.likes = [];
  }

  addLike(id, title, author, img){
    const like = {id, title, author, img};
    this.likes.push(like);
    //Update Likes in local Storage
    this.updateDataLS();
    return like;
  }

  deleteLike(id){
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);
    //Update Likes in local Storage
    this.updateDataLS();
  }

  isLiked(id){
    return this.likes.findIndex(el => el.id === id) !== -1; 
  }

  getNumLikes(){
    return this.likes.length;
  }

  updateDataLS(){
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  getDataLS(){
    const storage = localStorage.getItem('likes');
    if(storage)
      this.likes = JSON.parse(storage);
  }

}