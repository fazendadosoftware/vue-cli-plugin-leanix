<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>{{msg}}</h1>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      msg: ''
    }
  },
  created () {
    this.$lx.init()
      .then(setupInfo => {
        // Process setupInfo and create config object
        const config = {}
        this.$lx.ready(config)
      })
    setInterval(() => {
      this.msg = new Date().toISOString()
    }, 1000)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
