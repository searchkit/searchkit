import '@algolia/autocomplete-theme-classic'

import { startAutocomplete } from './autocomplete'
import { search } from './instantsearch'

search.start()
startAutocomplete(search)
