var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from "react";
import { SearchkitComponent } from "searchkit";
const Autosuggest = require("react-autosuggest");
import { DatasourceManager } from "./datasources/DatasourceManager";
// import "./styles.css"
const trim = require("lodash/trim");
const each = require("lodash/each");
const prop = require("lodash/property");
function renderSuggestion(suggestion) {
    return (React.createElement("span", null,
        suggestion.key,
        " ",
        suggestion.doc_count && React.createElement("i", null,
            "(",
            suggestion.doc_count,
            ") ")));
}
function renderSectionTitle(section) {
    return (React.createElement("strong", null,
        section.title,
        " "));
}
export class SearchkitAutosuggest extends SearchkitComponent {
    constructor(props) {
        super(props);
        this.onChange = (_event, { newValue, method }) => {
            if (method === 'type') {
                this.setState({
                    value: newValue
                });
            }
        };
        this.renderInputComponent = (inputProps) => {
            let props = Object.assign({}, inputProps, { className: inputProps.className + " sk-search-box__text" });
            return (React.createElement("div", { className: "sk-search-box" },
                React.createElement("div", { className: "sk-search-box__icon" }, " "),
                React.createElement("input", Object.assign({}, props)),
                this.state.loading && (React.createElement("div", { "data-qa": "loader", className: "sk-search-box__loader sk-spinning-loader is-hidden" }, " "))));
        };
        // Autosuggest will call this function every time you need to update suggestions.
        // You already implemented this logic above, so just use it.
        this.onSuggestionsFetchRequested = ({ value }) => __awaiter(this, void 0, void 0, function* () {
            value = trim(value);
            if (value.length >= 1) {
                this.setState({
                    isLoading: true
                });
                let suggestions = yield this.datasourceManager.search(value);
                if (value === this.state.value) {
                    this.setState({ suggestions, isLoading: false });
                }
            }
            else {
                this.setState({ suggestions: [] });
            }
        });
        this.onSuggestionSelected = (_e, { suggestion }) => {
            this.setState({
                value: suggestion.select() || ""
            });
        };
        // Autosuggest will call this function every time you need to clear suggestions.
        this.onSuggestionsClearRequested = () => {
            this.setState({
                suggestions: []
            });
        };
        this.state = {
            value: '',
            isLoading: false,
            suggestions: [],
            onFocus: false
        };
    }
    componentDidMount() {
        this.datasourceManager = new DatasourceManager(this.searchkit, this.props.sources);
    }
    render() {
        const { value, suggestions } = this.state;
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'search',
            value,
            onChange: this.onChange
        };
        return (React.createElement(Autosuggest, { className: "sk-searchbox", multiSection: true, suggestions: suggestions, onSuggestionsFetchRequested: this.onSuggestionsFetchRequested, onSuggestionsClearRequested: this.onSuggestionsClearRequested, onSuggestionSelected: this.onSuggestionSelected, highlightFirstSuggestion: false, getSuggestionValue: prop("key"), getSectionSuggestions: prop("results"), renderSectionTitle: renderSectionTitle, renderInputComponent: this.renderInputComponent, renderSuggestion: renderSuggestion, inputProps: inputProps }));
    }
}
SearchkitAutosuggest.defaultProps = {
    accessors: []
};
//# sourceMappingURL=SearchkitAutosuggest.js.map