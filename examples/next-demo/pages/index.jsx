import { withSearchkit, withSearchkitRouting } from '@searchkit/client'
import dynamic from 'next/dynamic'
import withApollo from '../hocs/withApollo'
import '@elastic/eui/dist/eui_theme_light.css'

const Search = dynamic(() => import('../components/index'), { ssr: false })

export default withApollo(withSearchkit(withSearchkitRouting(Search)))
