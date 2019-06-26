# Introduction

::: warning COMPATIBILITY NOTE
This plugin is intended to be used in a project created with [Vue CLI 3](https://cli.vuejs.org/) and requires **Node.js >= 8**.
:::

The [Vue LeanIX plugin](https://github.com/fazendadosoftware/vue-cli-plugin-leanix) allows to add the [LeanIX Custom Report Library API](https://leanix.github.io/leanix-reporting/classes/lxr.lxcustomreportlib.html) to an existing [Vue CLI 3](https://cli.vuejs.org/) project in order to create a custom report.


## How It Works

A VuePress site is in fact a SPA powered by [Vue](http://vuejs.org/), [Vue Router](https://github.com/vuejs/vue-router) and [webpack](http://webpack.js.org/). If you've used Vue before, you will notice the familiar development experience when you are writing or developing custom themes (you can even use Vue DevTools to debug your custom theme!).

During the build, we create a server-rendered version of the app and render the corresponding HTML by virtually visiting each route. This approach is inspired by [Nuxt](https://nuxtjs.org/)'s `nuxt generate` command and other projects like [Gatsby](https://www.gatsbyjs.org/).

Each Markdown file is compiled into HTML with [markdown-it](https://github.com/markdown-it/markdown-it) and then processed as the template of a Vue component. This allows you to directly use Vue inside your Markdown files and is great when you need to embed dynamic content.

## Features

- [Built-in Markdown extensions](./markdown.md) optimized for technical documentation
- [Ability to leverage Vue inside Markdown files](./using-vue.md)
- [Vue-powered custom theme system](./custom-themes.md)
- [Automatic Service Worker generation](../config/README.md#serviceworker)
- [Google Analytics Integration](../config/README.md#ga)
- ["Last Updated" based on Git](../default-theme-config/README.md#last-updated)
- [Multi-language support](./i18n.md)
- A default theme with:
  - Responsive layout
  - [Optional Homepage](../default-theme-config/README.md#homepage)
  - [Simple out-of-the-box header-based search](../default-theme-config/README.md#built-in-search)
  - [Algolia Search](../default-theme-config/README.md#algolia-search)
  - Customizable [navbar](../default-theme-config/README.md#navbar) and [sidebar](../default-theme-config/README.md#sidebar)
  - [Auto-generated GitHub link and page edit links](../default-theme-config/README.md#git-repo-and-edit-links)
