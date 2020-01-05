import * as React from 'react'
import { SearchkitComponent, SearchkitComponentProps } from 'searchkit'
import Autosuggest from 'react-autosuggest'
import trim from 'lodash/trim'
import prop from 'lodash/property'
import { DatasourceManager } from './datasources/DatasourceManager'
import { Source } from './datasources/Types'
import '../styles/styles.css'
import { QueryHandler, queryDelegateFactory, QueryDelegate } from './QueryDelegates'

function renderSuggestion(suggestion) {
  if (suggestion.render) {
    return suggestion.render()
  }
  return (
    <span>
      {suggestion.key} {suggestion.doc_count && <i>({suggestion.doc_count}) </i>}
    </span>
  )
}

function renderSectionTitle(section) {
  return <strong>{section.title} </strong>
}

export interface SearchkitAutosuggestProps extends SearchkitComponentProps {
  sources: Array<Source>
  autofocus: boolean
  queryHandler?: QueryHandler
  placeholder?: string
  highlightFirst?: boolean
}

export class SearchkitAutosuggest extends SearchkitComponent<SearchkitAutosuggestProps, any> {
  datasourceManager: DatasourceManager
  queryDelegate: QueryDelegate
  static defaultProps = {
    sources: [],
    autofocus: false,
    queryHandler: () => {},
    placeholder: 'search',
    highlightFirst: false
  }
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      suggestions: [],
      onFocus: false
    }
    this.queryDelegate = queryDelegateFactory(this.props.queryHandler)
  }
  componentWillMount() {
    super.componentWillMount()
    this.queryDelegate.register(this.searchkit)
  }
  componentDidMount() {
    this.datasourceManager = new DatasourceManager(this.searchkit, this.props.sources)
  }

  onChange = (_event, { newValue, method }) => {
    if (method === 'type') {
      this.queryDelegate.update(newValue)
    }
  }

  updateQueryHandler(value) {
    this.queryDelegate.update(value)
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.queryDelegate.submit()
  }

  renderInputComponent = (inputProps) => {
    const props = {
      ...inputProps,
      className: inputProps.className + ' sk-search-box__text'
    }
    return (
      <div className="sk-search-box">
        <div className="sk-search-box__icon"> </div>
        <form onSubmit={this.onSubmit}>
          <input {...props} />
        </form>
        {this.state.loading && (
          <div
            data-qa="loader"
            className="sk-search-box__loader sk-spinning-loader is-hidden"
          ></div>
        )}
      </div>
    )
  }

  onSuggestionsFetchRequested = async ({ value }) => {
    value = trim(value)
    if (value.length >= 1) {
      this.setState({
        isLoading: true
      })
      const suggestions = await this.datasourceManager.search(value)
      if (value === this.queryDelegate.getValue()) {
        this.setState({ suggestions, isLoading: false })
      }
    } else {
      this.setState({ suggestions: [] })
    }
  }

  onSuggestionSelected = (_e, { suggestion }) => {
    const newValue = suggestion.select() || ''
    this.queryDelegate.submit(newValue)
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  render() {
    const { suggestions } = this.state
    const { autofocus, placeholder, highlightFirst } = this.props
    // Autosuggest will pass through all these props to the input.
    const value = this.queryDelegate.getValue()
    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange,
      autoFocus: autofocus
    }

    return (
      <div className="sk-searchbox">
        <Autosuggest
          multiSection={true}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          highlightFirstSuggestion={highlightFirst}
          getSuggestionValue={prop('key')}
          getSectionSuggestions={prop('results')}
          renderSectionTitle={renderSectionTitle}
          renderInputComponent={this.renderInputComponent}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    )
  }
}
