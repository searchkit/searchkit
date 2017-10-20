# Layout Components

Default set of layout components provided by Searchkit which work with Searchkit's default theme.

<img src="./assets/layout-components.png" />

## Example

```jsx
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
```
