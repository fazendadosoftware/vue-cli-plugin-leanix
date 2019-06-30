# Getting Started

::: warning COMPATIBILITY NOTE
This plugin is intended to be used in a project created with [Vue CLI 3](https://cli.vuejs.org/) and requires **Node.js >= 8**.
:::

The [Vue CLI LeanIX plugin](https://github.com/fazendadosoftware/vue-cli-plugin-leanix) allows quickly create custom-reports by adding the [LeanIX Custom Report Library API](https://leanix.github.io/leanix-reporting/classes/lxr.lxcustomreportlib.html) into an existing [Vue CLI 3](https://cli.vuejs.org/) project.


## Pre-requisites
* [Node.JS >= 8](https://nodejs.org/en/)
* [Vue CLI 3](https://cli.vuejs.org/)
* [Yarn](https://yarnpkg.com/pt-BR/) (optional)


## Quick-start
```bash
# create a new Vue CLI 3 project
vue create my-custom-report

# change directory to the newly created project root
cd my-custom-report

# add the leanix plugin to the project
vue add leanix

# launch the development server and start coding!
yarn serve # or npm run serve
```

::: warning
If you are on Windows using Git Bash with minTTY, the interactive prompts will not work. You must launch the command as `winpty vue.cmd create hello-world`.
If you however want to still use the `vue create my-custom-report` syntax, you can alias the command by adding the following line to your `~/.profile` file.
`alias vue='winpty vue.cmd'`
You will need to restart your Git Bash terminal session to pull in the updated profile file.
:::

::: tip TIP
After adding the [vue-cli-leanix-plugin](https://github.com/fazendadosoftware/vue-cli-plugin-leanix) to your Vue project the [leanix-reporting API](https://leanix.github.io/leanix-reporting/classes/lxr.lxcustomreportlib.html) will be acessible as a global variable ```lx``` or, inside each Vue instance, as ```this.$lx```.
:::

