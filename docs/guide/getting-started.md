# Getting Started

## Install pre-requisites
* [Node.JS >= 8](https://nodejs.org/en/)
* [Vue CLI 3](https://cli.vuejs.org/)
* [Yarn](https://yarnpkg.com/pt-BR/) (optional)

::: warning
If you are on Windows using Git Bash with minTTY, the interactive prompts will not work. You must launch the command as `winpty vue.cmd create hello-world`.
If you however want to still use the `vue create hello-world` syntax, you can alias the command by adding the following line to your `~/.bashrc` file.
`alias vue='winpty vue.cmd'`
You will need to restart your Git Bash terminal session to pull in the updated bashrc file.
:::

## Create a custom-report
```bash
# create a new Vue CLI 3 project
vue create hello-world

# change directory to the newly created project root
cd hello-world

# add the leanix plugin to the project
vue add leanix

# launch the development server
yarn serve # or npm run serve
```
