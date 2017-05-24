# Migrating from Searchkit 0.7.x

## Styles & Theming
Some of Searchkit's internal classNames have changed, if you use the default Searchkit theme then no changes should be required, however custom css targeting certain elements may need to reviewed.

## List Components
Many of Searchkit's components now support the listComponent property, so if you have extended components previously it might be worth checking if there is a simply way now using our out the box List Components or making your own.

## RefinementListFilter, MenuFilter itemComponent changes
If you have implemented a custom itemComponent, the toggleFilter action function has been renamed to onClick, be sure to rename so that clicking facets works as expected.

## Hits List Component
If you have needed to extend Hits internals to do views such as Table views, checkout the Hits docs as we now provide a simpler way to do these customizations.
