# Translate

All components run a translate function on any text displayed. This includes:

- filter options (for when options are ids and required to be rendered in text)
- previous / next navigation
- show more / show less / show all action text
- search placeholder

and many more in components.

## How to override defaults
```js

const searchkit = new SearchkitManager("locahost:9200")

searchkit.translateFunction = (key) => {
  let translations = {
    "Previous":"Previous page",
    "id1":"Color",
    "id2": "Red"
  }
  return translations[key] || key;
}
```
