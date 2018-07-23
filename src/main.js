// 挂载垫片
import "./js/polyfill";
import Vue from 'vue'
import App from './App'
//引入router
import router from "./router";

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render(h) {
        return h(App)
    }
})
