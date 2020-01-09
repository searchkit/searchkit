import { SourceFilterType } from '../query'
import { Accessor } from './Accessor'

export class SourceFilterAccessor extends Accessor {
  constructor(public source: SourceFilterType) {
    super()
  }

  buildSharedQuery(query) {
    return query.setSource(this.source)
  }
}
