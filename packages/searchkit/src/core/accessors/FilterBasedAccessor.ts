import { State } from '../state'
import { StatefulAccessor } from './StatefulAccessor'

export class FilterBasedAccessor<T extends State<any>> extends StatefulAccessor<T> {}
