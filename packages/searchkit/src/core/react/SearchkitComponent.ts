import * as React from "react";
import * as PropTypes from "prop-types";
import { SearchkitManager } from "../SearchkitManager";
import { ImmutableQuery } from "../query";
import { Accessor } from "../accessors/Accessor";
import { Utils } from "../support";
const mapValues = require("lodash/mapValues");
import { block } from "./block";

export interface SearchkitComponentProps {
  mod?: string;
  className?: string;
  translations?: Object;
  searchkit?: SearchkitManager;
  key?: string;
}

export class SearchkitComponent<
  P extends SearchkitComponentProps,
  S
> extends React.Component<P, S> {
  _accessor: Accessor;
  _searchkit: SearchkitManager;
  stateListenerUnsubscribe: Function;
  translations: Object = {};
  unmounted = false;

  static contextTypes: React.ValidationMap<any> = {
    searchkit: PropTypes.instanceOf(SearchkitManager)
  };

  static translationsPropType = translations => {
    return PropTypes.shape(mapValues(translations, () => PropTypes.string));
  };

  static propTypes: any = {
    mod: PropTypes.string,
    className: PropTypes.string,
    translations: PropTypes.objectOf(PropTypes.string),
    searchkit: PropTypes.instanceOf(SearchkitManager)
  };

  constructor(props?) {
    super(props);
    this.translate = this.translate.bind(this);
  }

  defineBEMBlocks() {
    return null;
  }

  defineAccessor(): Accessor {
    return null;
  }

  translate(key, interpolations?) {
    let translation =
      this.searchkit.translate(key) ||
      (this.props.translations && this.props.translations[key]) ||
      this.translations[key] ||
      key;
    return Utils.translate(translation, interpolations);
  }

  get bemBlocks(): any {
    return mapValues(this.defineBEMBlocks(), cssClass => {
      return block(cssClass).el;
    });
  }

  get searchkit(): SearchkitManager {
    return this._searchkit || (this._searchkit = this._getSearchkit());
  }

  _getSearchkit(): SearchkitManager {
    return this.props.searchkit || this.context["searchkit"];
  }

  set searchkit(value: SearchkitManager) {
    this._searchkit = value;
  }

  componentDidMount() {
    this.initAccessor();
    if (this.searchkit) {
      this.stateListenerUnsubscribe = this.searchkit.emitter.addListener(() => {
        if (!this.unmounted) {
          this.forceUpdate();
        }
      });
    }
  }

  /**
   * This method should not be called before render() (to avoid conflicts between mounting and unmounting components due to asynchronous nature of React 16)
   * Call explicitly in render() if accessor is needed in other components at their render() (see TagFilterConfig and ViewSwitcherConfig)
   */
  initAccessor() {
    if (this.searchkit && !this._accessor) {
      this._accessor = this.defineAccessor();
      if (this._accessor) {
        this._accessor = this.searchkit.addAccessor(this._accessor);
      }
    } else if (!this.searchkit) {
      console.warn(
        "No searchkit found in props or context for " + this.constructor["name"]
      );
    }
  }

  get accessor(): Accessor {
    this.initAccessor();
    return this._accessor;
  }

  componentWillUnmount() {
    if (this.stateListenerUnsubscribe) {
      this.stateListenerUnsubscribe();
    }
    if (this.searchkit && this.accessor) {
      this.searchkit.removeAccessor(this.accessor);
    }
    this.unmounted = true;
  }

  getResults() {
    return this.searchkit.results;
  }

  getHits() {
    return this.searchkit.getHits();
  }

  getHitsCount() {
    return this.searchkit.getHitsCount();
  }

  hasHits() {
    return this.searchkit.hasHits();
  }

  hasHitsChanged() {
    return this.searchkit.hasHitsChanged();
  }

  getQuery(): ImmutableQuery {
    return this.searchkit.query;
  }

  isInitialLoading() {
    return this.searchkit.initialLoading;
  }

  isLoading() {
    return this.searchkit.loading;
  }

  getError() {
    return this.searchkit.error;
  }
}
