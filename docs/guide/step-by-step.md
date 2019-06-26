# Step-by-step tutorial

LeanIX custom reports are a great tool for analysing and communicating EA insights in an effective way.

## Create your project
follow instructions

## Initialize the reporting framework
```vue
<script>
export default {
  created () {
    this.$lx.init()
      .then(setup => {
        console.debug(`report setup`, setup)
      })
  }
}
</script>
```