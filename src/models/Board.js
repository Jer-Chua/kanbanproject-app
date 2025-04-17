export default class Board {
    constructor(id, name, createdAt = new Date()) {
      this.id = id;
      this.name = name;
      this.createdAt = createdAt;
    }
  }
  