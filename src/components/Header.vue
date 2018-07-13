<template>
    <div class="container-head">
        <span>{{title}}</span>
        <span class="rg" v-show="$route.name==='playing'" @click="restart">重新开始</span>
    </div>
</template>

<script>
export default {
    name: "my-header",
    computed: {
        title() {
            return this.$route.meta.title || "三扣一计分器";
        },
    },
    methods: {
        restart() {
            if (confirm("是否开始新游戏")) {
                this.$router.push("/rule");
            }
        },
    },
};
</script>


<style lang="less" scoped>
.container-head {
    height: 100%;
    color: #fff;
    background: #509de3;
    position: relative;
    .rg {
        height: 100%;
        position: absolute;
        right: 1em;
        top: 0;
        cursor: pointer;
        font-size: 0.8em;
    }
}
</style>

