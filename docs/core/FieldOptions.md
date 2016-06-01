# FieldOptions

`Searchkit` allows customizing certain components for use with `nested` or `children` fields

## Supported components

- RefinementListFilter
- MenuFilter
- RangeFilter
- NumericRefinementListFilter
- DynamicRangeFilter

## Nested Example

```jsx
  <RefinementListFilter
    id="embeddedTags"
    title= "Embedded Tags"
    field='tags.name'
    fieldOptions={{type:'nested', options:{path:'tags'}}}/>    
```

### fieldOptions.options (type='nested')
- `path` mandatory path needed by elastic
- `score_mode` optional
- `inner_hits` optional


## Children Example

```jsx
<RefinementListFilter
  id="childrenTags"
  title= "Children Tags"
  field='name'
  fieldOptions={{type:'children', options:{childType:'tags'}}}/>  
```

### fieldOptions.options (type='children')
- `childType` mandatory childType needed by elastic
- `score_mode` optional
- `inner_hits` optional
- `min_children` optional
- `max_children` optional
