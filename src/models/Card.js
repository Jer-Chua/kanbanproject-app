export default class Card {
    constructor(id, title, description = '', position = 0) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.position = position;
    }
  }
  