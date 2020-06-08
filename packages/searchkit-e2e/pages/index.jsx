import withApollo from '../hocs/withApollo'
import { withSearchkit } from '@searchkit/client'
import dynamic from 'next/dynamic'

const Search = dynamic(import('../components/index'), { ssr: false })

const Index = (props) => {
  return <Search />
}

export default withApollo(withSearchkit(Index))
