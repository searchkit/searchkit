export default class BoolField {
  bool:Object = {}
  
  must(field){
    this.setArrayField("must", field)
  }

  should(field){
    this.setArrayField("should", field)
  }

  setArrayField(key, field){
    this.bool[key]  = this.bool[key] || []
    this.bool[key].push(field)
    this.bool[key] = _.flatten(this.bool[key])
  }

}
