import Vue from "vue";
import App from "./App.vue";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
