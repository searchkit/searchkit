# Extending Theme

You want to use the layout but want to adjust the colors, fonts to suit your app. Searchkit's Theming uses a set of [default SCSS variables](https://github.com/searchkit/searchkit/blob/develop/theming/vars.scss).

You can override the defaults by importing `theme.scss` into your own project and overriding the variables.

Example in webpack sass loader

```sass

$sk-action-text-color: red;

@import "~searchkit/theming/theme.scss";

```
