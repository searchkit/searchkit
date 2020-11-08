import { withSearchkit } from '@searchkit/client'
import withApollo from '../hocs/withApollo'
import Search from '../components/index'

const Index = (props) => {
  return <Search />
}

export default withApollo(withSearchkit(Search))
