const {
  SearchkitManager,SearchkitProvider,
  SearchBox, Hits, Pagination,
  HitsStats, SortingSelector, NoHits,
  GroupedSelectedFilters,
  ItemHistogramList,
  ActionBar, ActionBarRow, ResetFilters,
  HierarchicalRefinementFilter,
  RefinementListFilter,
  DateRangeFilter, DateRangeCalendar
} = require("../../../../../src")
const host = "http://localhost:9200/events"
import * as ReactDOM from "react-dom";
import * as React from "react";
import * as moment from "moment";
const searchkit = new SearchkitManager(host)

import * as _ from "lodash"

require("../../../../../theming/theme.scss")
require("./customisations.scss")

const HitItem = (props)=> {
  const {bemBlocks, result} = props
  const source:any = _.extend({}, result._source, result.highlight)

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit" style={{margin:"1em 0"}}>
      <h2 data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}} style={{margin:"0"}}></h2>
      <div>
        <small data-qa="fromDate" className={bemBlocks.item("fromDate")}>Start {source.event_date.from} </small>
        <small data-qa="toDate" className={bemBlocks.item("toDate")}>End {source.event_date.to}</small>
      </div>
      <div><small data-qa="dates" className={bemBlocks.item("dates")} dangerouslySetInnerHTML={{__html:source.event_date_pretty}}></small></div>
      <div><small data-qa="leading" className={bemBlocks.item("leading")} dangerouslySetInnerHTML={{__html:source.lead_paragraph}}></small></div>
    </div>
  )
}

class App extends React.Component<any, any> {
  render(){
    return (
      <SearchkitProvider searchkit={searchkit}>
        <div className="sk-layout range-app">

          <div className="sk-layout__top-bar sk-top-bar">
            <div className="sk-top-bar__content">
              <div className="my-logo">Calendar components</div>
              <SearchBox
                autofocus={true}
                searchOnChange={true}
                prefixQueryFields={["title^10"]}/>
            </div>
          </div>

          <div className="sk-layout__body">

            <div className="sk-layout__filters">
              <div className="sk-layout__filters-row">

                <DateRangeFilter
                  id="event_date"
                  title="Date range"
                  fromDateField="event_date.from"
                  toDateField="event_date.to"
                  calendarComponent={DateRangeCalendar}
                  fieldOptions={{
                    type: 'embedded',
                    options: {
                      path: 'event_date'
                    }
                  }}
                  rangeFormatter={(v) => moment(parseInt(""+v)).format('D.M.YYYY')}
                />

                <RefinementListFilter
                  id="event_types"
                  title="Event type"
                  field="event_types"
                  operator="AND"
                  listComponent={ItemHistogramList}
                  size={5}
                />

                <HierarchicalRefinementFilter
                  id="hobby_category"
                  title="Hobby type"
                  field="hobby_category"
                  orderKey="hobby_category.level"
                />

                <RefinementListFilter
                  id="district"
                  title="City district"
                  field="district"
                  operator="AND"
                  listComponent={ItemHistogramList}
                  size={5}
                />

                <RefinementListFilter
                  id="keywords"
                  title="Keywords"
                  field="keywords"
                  operator="AND"
                  listComponent={ItemHistogramList}
                  size={5}
                />

                <RefinementListFilter
                  id="hobby_details"
                  title="Details"
                  field="hobby_details"
                  operator="AND"
                  listComponent={ItemHistogramList}
                />

              </div>
            </div>

            <div className="sk-layout__results sk-results-list">
              <ActionBar>
                <ActionBarRow>
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
                <ActionBarRow>
                  <HitsStats translations={{
                    "hitstats.results_found":"{hitCount} results found"
                  }}/>
                </ActionBarRow>
              </ActionBar>
              <div style={{margin:"15px"}}>
                <Hits
                    hitsPerPage={15}
                    highlightFields={["title"]}
                    itemComponent={HitItem}
                    scrollTo="body"
                />
              </div>
              <NoHits suggestionsField={"title"}/>
              <Pagination showNumbers={true}/>
            </div>
          </div>
        </div>
      </SearchkitProvider>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"))
