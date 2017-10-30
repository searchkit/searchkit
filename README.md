## What is Searchkit?
[<img src="https://circleci.com/gh/searchkit/searchkit.png?style=shield"/>](https://circleci.com/gh/searchkit/searchkit)
[![npm version](https://badge.fury.io/js/searchkit.svg)](https://badge.fury.io/js/searchkit)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/searchkit/badge?style=rounded)](https://www.jsdelivr.com/package/npm/searchkit)
[![Join the chat at https://gitter.im/searchkit/searchkit](https://badges.gitter.im/searchkit/searchkit.svg)](https://gitter.im/searchkit/searchkit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Coverage Status](https://coveralls.io/repos/searchkit/searchkit/badge.svg?branch=develop&service=github)](https://coveralls.io/github/searchkit/searchkit?branch=develop)

Searchkit is a suite of UI components built in react. The aim is to rapidly create beautiful search applications using declarative components, and without being an ElasticSearch expert.

<img src="./packages/searchkit-docs/docs/assets/codepreview.png"/>

## Quick Start
Checkout Searchkit starter app (https://github.com/searchkit/searchkit-starter-app). Based off Facebook's Create-react-app project. Clone repo and add your changes!

See full [Documentation](http://docs.searchkit.co/stable) or [Getting Started](http://docs.searchkit.co/stable/docs/setup/project-setup.html)

## Quick Intro
[Live demo](http://demo.searchkit.co)

```jsx
const searchkit = new SearchkitManager("http://demo.searchkit.co/api/movies/")


const App = ()=> (
  <SearchkitProvider searchkit={searchkit}>
    <Layout>
      <TopBar>
        <SearchBox
          autofocus={true}
          searchOnChange={true}
          prefixQueryFields={["actors^1","type^2","languages","title^10"]}/>
      </TopBar>
      <LayoutBody>
        <SideBar>
          <HierarchicalMenuFilter
            fields={["type.raw", "genres.raw"]}
            title="Categories"
            id="categories"/>
          <RefinementListFilter
            id="actors"
            title="Actors"
            field="actors.raw"
            operator="AND"
            size={10}/>
        </SideBar>
        <LayoutResults>
          <ActionBar>

            <ActionBarRow>
              <HitsStats/>
            </ActionBarRow>

            <ActionBarRow>
              <SelectedFilters/>
              <ResetFilters/>
            </ActionBarRow>

          </ActionBar>
          <Hits mod="sk-hits-grid" hitsPerPage={10} itemComponent={MovieHitsGridItem}
            sourceFilter={["title", "poster", "imdbId"]}/>
          <NoHits/>
        </LayoutResults>
      </LayoutBody>
    </Layout>
  </SearchkitProvider>
)

ReactDOM.render(<App/>, document.getElementById('root'))


```
