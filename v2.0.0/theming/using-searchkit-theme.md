# Using Searchkit's Theme

<img src="./../assets/searchkit-theme.png"/>

We provide an out of the box theme to get developers started quickly.

## Getting Started

To use Searchkit's theme, add the `theme.css` file onto your site. You can use either the CDN link or the `theme.css` file in searchkit's release folder. If using the CDN link, please change the version number which matches your Searchkit version.

```html

<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/searchkit/0.9.0/theme.css">

```

## Layout Areas

```html

// layout components
import {
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar
} from "searchkit"

<Layout>

  <TopBar>
      // red area
      <SearchBox .../>
  </TopBar>

  <LayoutBody>

    <SideBar>
      // yellow area
      <HierarchicalMenuFilter .../>
      <RefinementListFilter .../>
    </SideBar>

    <LayoutResults>

      <ActionBar>
        <ActionBarRow>
          // blue area
          <HitsStats .../>
          <ViewSwitcherToggle/>
          <SortingSelector .../>
        </ActionBarRow>

        <ActionBarRow>
          // aqua area
          <SelectedFilters/>
          <ResetFilters/>
        </ActionBarRow>

      </ActionBar>

      // green area
      <Hits ../>
      <Pagination .../>

    </LayoutResults>

  </LayoutBody>

</Layout>
```

When you include searchkit's `theme.css`, we provide you a basic layout.

## Layout Max width
You can control the max-width of the layout by adding `size` prop to the `layout` component.

* `<layout size="m">` : max-width of 960px
* `<layout size="l">` : max-width of 1280px

If no size class is applied, layout will use the full width of the browser.

## Grid / List Hit Items
We provide out of the box styles for Hit items for Grid and List Views. See `ViewSwitcherHits` component.

### Example

<img src="./../assets/grid-view.jpg"/>

```jsx

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        // red area
        <img data-qa="poster" className={bemBlocks.item("poster")} src={source.poster} width="170" height="240"/>
        // green area
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>
        </div>
      </a>
    </div>
  )
}

```

<img src="./../assets/list-view.jpg"/>

```jsx

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        // green area
        <img data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        // aqua area
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        // red area
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        // blue area
        <ul className={bemBlocks.item("tags")}>
          <li>Genres: <TagFilterList field="genres.raw" values={genres} /></li>
          <li>Writers: <TagFilterList field="writers.raw" values={writers} /></li>
          <li>Actors: <TagFilterList field="actors.raw" values={actors} /></li>
        </ul>
        // yellow area
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

```

and to use these display components, use the `ViewSwitcherHits` component to switch between views.

```jsx

<ViewSwitcherHits
    hitsPerPage={12} highlightFields={["title","plot"]}
    sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year"]}
    hitComponents = {[
      {key:"grid", title:"Grid", itemComponent:MovieHitsGridItem, defaultOption:true},
      {key:"list", title:"List", itemComponent:MovieHitsListItem}
    ]}
    scrollTo="body"
/>
```

## Using one view type

If you only want to use the grid view or list view, you need to specify on the `hits` component, the `mod` prop to be either `sk-hits-list` for list components or `sk-hits-grid` for grid components.

```jsx
  <Hits hitsPerPage={10} mod="sk-hits-list" itemComponent={ExampleHitsItem}/>
```
