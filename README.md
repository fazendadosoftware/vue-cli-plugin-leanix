# vue-cli-plugin-leanix
[![npm version](https://badge.fury.io/js/vue-cli-plugin-leanix.svg)](https://badge.fury.io/js/vue-cli-plugin-leanix)

**:rocket: Start building a LeanIX custom report with Vue in 2 minutes!**

This is a vue-cli 3.x plugin to transform a Vue project into a LeanIX custom report.

<br>

<h3 align="center"><a href="https://fazendadosoftware.github.io/vue-cli-plugin-leanix/">Documentation</a></h3>

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

### Start the development server:
```
npm run serve
```

The leanix-reporting lx object is globally available as ```lx```, and at each Vue instance as ```this.$lx```

### Upload the report to the LeanIX workspace:
```
npm run upload
```
