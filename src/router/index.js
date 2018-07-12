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
                    meta: {
                        title: "规则定制中",
                    },
                    component: resolve => require(['@/components/Rule.vue'], resolve),
                },
                {
                    path: "playing",
                    name: "playing",
                    meta: {
                        title: "游戏进行中",
                    },
                    component: resolve => require(['@/components/Playing.vue'], resolve),
                },
            ]
        },
    ]
});

export default router
