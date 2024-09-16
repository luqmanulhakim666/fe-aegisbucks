import Vue from 'vue'
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'

// Globally register your component
Vue.component('vue-timepicker', VueTimepicker)

new Vue({
  render: (h) => h(App)
})
