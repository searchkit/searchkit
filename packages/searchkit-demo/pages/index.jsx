import { withSearchkit } from '@searchkit/client'
import withApollo from '../hocs/withApollo'
import Search from '../components/index'


export default withApollo(withSearchkit(Search))
