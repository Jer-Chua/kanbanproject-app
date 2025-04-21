export default class Column {
    constructor(id, name, category, description ,position = 0) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.category = category;
      this.position = position;
    }
  }
  