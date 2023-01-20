import { RefinementList, InstantSearch } from "react-instantsearch-dom";
import Client from '@searchkit/instantsearch-client';

const api = "/api/product-search"

const searchClient = Client({ url: api });

export const SimpleExample = () => {
  return (
    <div className="bg-white max-w-lg">
      <InstantSearch indexName="mrp-products_sk" searchClient={searchClient} >
        <RefinementList attribute="designerName"/>
      </InstantSearch>
    </div>
  )
  }