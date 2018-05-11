## What is Searchkit?
[<img src="https://circleci.com/gh/searchkit/searchkit.png?style=shield"/>](https://circleci.com/gh/searchkit/searchkit)
 [![npm version](https://badge.fury.io/js/searchkit.svg)](https://badge.fury.io/js/searchkit)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/searchkit/badge?style=rounded)](https://www.jsdelivr.com/package/npm/searchkit)
[![Join the chat at https://gitter.im/searchkit/searchkit](https://badges.gitter.im/searchkit/searchkit.svg)](https://gitter.im/searchkit/searchkit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Coverage Status](https://coveralls.io/repos/searchkit/searchkit/badge.svg?branch=develop&service=github)](https://coveralls.io/github/searchkit/searchkit?branch=develop)
[![Backers on Open Collective](https://opencollective.com/searchkit/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/searchkit/sponsors/badge.svg)](#sponsors)

Searchkit is a suite of UI components built in react. The aim is to rapidly create beautiful search applications using declarative components, and without being an ElasticSearch expert.

<img src="./packages/searchkit-docs/docs/assets/codepreview.png"/>

## Quick Start
Checkout Searchkit starter app (https://github.com/searchkit/searchkit-starter-app). Based off Facebook's Create-react-app project. Clone repo and add your changes!

See full [Documentation](http://docs.searchkit.co/stable) or [Getting Started](http://docs.searchkit.co/stable/setup/project-setup.html)

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

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/searchkit/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/searchkit#backer)]

<a href="https://opencollective.com/searchkit#backers" target="_blank"><img src="https://opencollective.com/searchkit/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/searchkit#sponsor)]

<a href="https://opencollective.com/searchkit/sponsor/0/website" target="_blank"><img src="https://opencollective.com/searchkit/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/searchkit/sponsor/1/website" target="_blank"><img src="https://opencollective.com/searchkit/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/searchkit/sponsor/2/website" target="_blank"><img src="https://opencollective.com/searchkit/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/searchkit/sponsor/3/website" target="_blank"><img src="https://opencollective.com/searchkit/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/searchkit/sponsor/4/website" target="_blank"><img src="https://opencollective.com/searchkit/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/searchkit/sponsor/5/website" target="_blank"><img src="https://opencollective.com/searchkit/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/searchkit/sponsor/6/website" target="_blank"><img src="https://opencollective.com/searchkit/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/searchkit/sponsor/7/website" target="_blank"><img src="https://opencollective.com/searchkit/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/searchkit/sponsor/8/website" target="_blank"><img src="https://opencollective.com/searchkit/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/searchkit/sponsor/9/website" target="_blank"><img src="https://opencollective.com/searchkit/sponsor/9/avatar.svg"></a>


