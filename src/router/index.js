//引入依赖
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: "/",
            name: "home",
            component: resolve => require(['../App.vue'], resolve),
            children: [
                {
                    path: "rule",
                    name: "rule",
                    component: resolve => require(['@/components/Rule.vue'], resolve),
                },
            ]
        },
    ]
});

export default router
