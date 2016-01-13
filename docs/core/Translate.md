# Translate

All components run a translate function on any text displayed. This includes:

- filter options (for when options are ids and required to be rendered in text)
- previous / next navigation
- show more / show less / show all action text
- search placeholder

and many more in components.

## How to override global defaults
```js

const searchkit = new SearchkitManager("locahost:9200")

searchkit.translateFunction = (key) => {
  let translations = {
    "pagination.previous":"Previous page",
    "pagination.next":"Next page",
    "id1":"Color",
    "id2": "Red"
  }
  return translations[key]
}
```

## Override component defaults

You can pass any component an object of translations you wish to override. Example below:

```
<SearchBox translations={{"searchbox.placeholder":"search movies"}} autofocus={true} searchOnChange={true} queryFields={["actors^1","type^2","languages","title^5", "genres^2"]}/>
```
