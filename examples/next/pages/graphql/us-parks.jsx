import { withSearchkit } from '@searchkit/client'
import dynamic from 'next/dynamic'
import withApollo from '../../hocs/withApollo'

const Search = dynamic(() => import('../../components/geosearch-examples/parks'), { ssr: false })

export default withApollo(withSearchkit(Search))
