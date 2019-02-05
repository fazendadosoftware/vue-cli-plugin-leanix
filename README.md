# vue-cli-plugin-leanix

Vue CLI 3 plugin for developing LeanIX custom reports.

## Pre-requisites

You need Vue CLI 3 installed globally as a pre-requisite. If you don't have it, please run

```
npm install -g @vue/cli

```

## Getting started

### Create a vue project from scratch
```
vue create <your_project_name>
cd <your_project_name>
```

### Add LeanIX support to the generated project:
```
vue add leanix
```
You will be prompted to for your leanix instance, apiToken and to choose if you want to use a demo component. If you pick `yes` option, the component will be created in `components` folder. It's a simple Handsontable's powered component listing the count of all factsheet types existing on the workspace.

### Start the development server:
```
yarn run serve
```

The leanix-reporting lx object is globally available as ```lx```, and at each Vue instance as ```vm.$lx```
