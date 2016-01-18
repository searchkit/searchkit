import {
  SearchkitComponent
} from "../../../"

describe("SearchkitComponent", ()=> {

  beforeEach(()=> {

  })

  it("SearchkitComponent.translatePropType", ()=> {
    let translations = {
      continueButton:"Continue",
      cancelButton:"Cancel"
    }

    let handler = SearchkitComponent
      .translationsPropType(translations)

    expect(handler(
      {translations:{
        continueButton:"Continue..."
      }},
      "translations", "MyComponent"
    )).toEqual(null)

    expect(handler(
      {translations:{
        unknown1:"",
        unknown2:""
      }},
      "translations", "MyComponent"
    )).toEqual(new Error(
      "MyComponent: incorrect translations, unknown1,unknown2 keys are not included in continueButton,cancelButton"
    ))


  })


})
