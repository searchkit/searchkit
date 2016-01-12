import {ImmutableQuery} from "../query"

export abstract class ESTransport {

  abstract search(query:Object):Promise<any>
}
