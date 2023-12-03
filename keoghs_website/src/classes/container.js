export default class container {
    constructor(name, weight) {
        this.name = name;
        this.weight = weight;
        this.constructor.instance = this;
      }
     /**
   * @name ExampleClass#setData
   * Role of this function is to set data
   * @param {Object} data
   */
    setData(data) {
        this.data = data;
      }
    
      /**
       * @name ExampleClass#getData
       * Role of this function is to get data
       * @returns {Object} data
       */
      getData() {
        return this.data;
      }
    }