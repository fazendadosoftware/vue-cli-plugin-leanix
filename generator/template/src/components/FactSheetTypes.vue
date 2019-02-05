<template>
  <hot-table :settings="hotSettings" />
</template>

<script>
import { HotTable } from '@handsontable/vue'

export default {
  name: 'FactSheetTypes',
  components: { HotTable },
  data () {
    return {
      hotSettings: {
        data: [],
        columns: [
          { data: 'type', type: 'text' },
          { data: 'count', type: 'numeric' }
        ],
        colHeaders: ['Type', 'Quantity'],
        colWidths: [300, 100],
        rowHeaders: false,
        strechH: 'all',
        disableVisualSelection: true
      }
    }
  },
  methods: {
    fetchFactSheetCount () {
      return new Promise((resolve, reject) => {
        const query = `{allFactSheets{edges{node{type}}}}`
        this.$lx.showSpinner()
        this.$lx.executeGraphQL(query)
          .then(res => {
            this.$lx.hideSpinner()
            let factSheets = res.allFactSheets.edges
              .map(edge => edge.node)
              .reduce((accumulator, factSheet) => {
                const { type } = factSheet
                if (!accumulator[type]) accumulator[type] = 0
                accumulator[type]++
                return accumulator
              }, {})
            factSheets = Object.entries(factSheets).map(([type, count]) => { return { type, count } })
            resolve(factSheets)
          })
          .catch(err => {
            this.$lx.hideSpinner()
            reject(err)
          })
      })
    }
  },
  computed: {
    recipients () {
      return this.application && Array.isArray(this.application.recipients) ? this.application.recipients : []
    }
  },
  created () {
    this.fetchFactSheetCount()
      .then(factSheets => { this.hotSettings.data = factSheets })
      .catch(err => { console.error(err) })
  }
}
</script>

<style scoped>
@import '~handsontable/dist/handsontable.full.css';
</style>
