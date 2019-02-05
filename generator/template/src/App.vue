<template>
  <div id="app">
    <h1 style="padding: 2.5rem 0">FactSheet Count</h1>
    <fact-sheet-types></fact-sheet-types>
  </div>
</template>

<script>
import FactSheetTypes from './components/FactSheetTypes'

export default {
  name: 'app',
  components: {
    FactSheetTypes
  }
}
</script>

<style>
html {
  overflow-y: auto;
}

body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-flow: column;
  height: 100vh;
  align-items: center;
}
</style>
