import * as React from "react"
import { SearchkitComponent, SearchkitComponentProps } from "searchkit"
const Autosuggest = require("react-autosuggest")
import { DatasourceManager } from "./datasources/DatasourceManager"
import { Source } from "./datasources/Types"
import "../styles/styles.css"

import trim  from "lodash/trim"
import each  from "lodash/each"
import prop  from "lodash/property"

function renderSuggestion(suggestion) {
    if( suggestion.render ){
        return suggestion.render()
    } else {
        return (
            <span>{suggestion.key} {suggestion.doc_count && <i>({suggestion.doc_count}) </i>}</span >
        );
    }
    
}

function renderSectionTitle(section) {
    return (
        <strong>{ section.title } </strong>
    );
}
export interface SearchkitAutosuggestProps extends SearchkitComponentProps{
    sources: Array<Source>,
    autofocus:Boolean
}

export class SearchkitAutosuggest extends SearchkitComponent<SearchkitAutosuggestProps, any> {
    datasourceManager:DatasourceManager

    static defaultProps = {
        sources: [],
        autofocus:false
    }
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isLoading: false,
            suggestions: [],
            onFocus: false
        };

    }

    componentDidMount() {
        this.datasourceManager = new DatasourceManager(
            this.searchkit, this.props.sources)
    }

    onChange = (_event, { newValue, method }) => {
        if (method === 'type') {
            this.setState({
                value: newValue
            });
        }

    };

    renderInputComponent = (inputProps) => {
        let props = {
            ...inputProps,
            className: inputProps.className + " sk-search-box__text"
        }
        return (
            <div className="sk-search-box">
            <div className="sk-search-box__icon"> </div>
                < input {...props } />
                { this.state.loading && (
                    <div data-qa="loader"
                    className="sk-search-box__loader sk-spinning-loader is-hidden" > </div>
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
            let suggestions = await this.datasourceManager.search(value)
            if (value === this.state.value) {
                this.setState({ suggestions, isLoading: false })
            }
        } else {
            this.setState({ suggestions: [] })
        }

    };

    onSuggestionSelected = (_e, { suggestion }) => {
        this.setState({
            value: suggestion.select() || ""
        })
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;
        const { autofocus } = this.props
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'search',
            value,
            onChange: this.onChange,
            autoFocus:autofocus
        };

        return (
            <Autosuggest
                className="sk-searchbox"
                multiSection = { true}
                suggestions = { suggestions }
                onSuggestionsFetchRequested = { this.onSuggestionsFetchRequested }
                onSuggestionsClearRequested = { this.onSuggestionsClearRequested }
                onSuggestionSelected = { this.onSuggestionSelected }
                highlightFirstSuggestion = { false}
                getSuggestionValue = { prop("key") }
                getSectionSuggestions = { prop("results") }
                renderSectionTitle = { renderSectionTitle }
                renderInputComponent = { this.renderInputComponent }
                renderSuggestion = { renderSuggestion }
                inputProps = { inputProps }
            />
        );
    }
}
