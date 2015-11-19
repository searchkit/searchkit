import {Component, Input, Button, List, defaults, field} from "xenon";

class ExamplePage extends Component {

  @field(Component, {qa:"test"})
  testElement: Component

}

var examplePage:ExamplePage = null;

describe("example", () => {

 beforeEach(() => {
   examplePage = new ExamplePage();
   browser.get("http://localhost:3000");
 })

 it("should show logo", () => {
   expect(examplePage.testElement.isVisible()).toBe(true)
 })

})
