# Migrating from Searchkit 0.6.x

## Styles & Theming
In 0.7, we revisited the way developers use our default styles. We now ship a supported layout and grid / list views. See theming section for more information

## sk- prefix Classnames
In 0.7, we have prefixed all searchkit's classnames with `sk-` to prevent potential collisions with your own styles.

## No more styles.css
We ship with only one css file, `theme.css`. This includes all component styles and basic searchkit layout.  

## Retain grid styling
`Hits` component requires `mod="sk-hits-grid"` to retain grid styling

## Examples + Docs
- [Example pull request to update to 0.7.0](https://github.com/PAK90/Gatherer2/pull/2/files)
- [Searchkit Theming documentation](../theming/using-searchkit-theme.md)
