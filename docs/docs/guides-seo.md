---
id: guides-seo
title: SEO Tips
sidebar_label: SEO Tips
slug: /core/guides/SEO-tips
---

Guide to enable good SEO practices for searchkit so the site can be indexed

## Enable Routing

Enabling routing using the Routing HOC will listen to state changes in searchkit client and update the url so if the customer bookmarked / shared the page, the state such as filters, query, sorting options will be chosen.

For more information on how to enable it, see [URL Synchronization guide](https://searchkit.co/docs/core/guides/url-synchronization)

## SEO friendly URLs

When routing is enabled, state will be serialised within the query parameter. Whilst theres a unique url for each search option, the URL isn't very SEO friendly. An example of a SEO friendly URL could be `http://demo.searchkit.co/type/all?size=10`. To do this, you can implement a custom `createURL` and `parseURL` functions. For more information, see [URL Synchronization guide](https://searchkit.co/docs/guides/url-synchronization) under the customising URL section.

## Use FilterLink & PaginationLink components

For search engines to follow and index pages, filter and pagination links need to have hrefs. Using the FilterLink and PaginationLink components, it will provide a href & onclick handler for applying the filter or page navigation easily.

See [Searchkit client reference](https://searchkit.co/docs/core/reference/searchkit-client) for more information on the components and usage.

## Server Side Rendering

Good SEO practice is for the page to be rendered on the server side and hydrated on the client side. Due to elastic-ui dependencies to the browser, the "out the box Searchkit components" cannot be used to render (hence why we specify to next to render only on client). You will need to build your own search components but its pretty straightforward to do.

For more information, see [SSR Rendering Guide](https://searchkit.co/docs/core/guides/ssr-server-side-rendering)
