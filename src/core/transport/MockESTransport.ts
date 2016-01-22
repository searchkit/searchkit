import {ESTransport} from "./ESTransport";

export class MockESTransport extends ESTransport {

  search(query){
    return Promise.resolve(query)
  }
}
