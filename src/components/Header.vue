<template>
    <div class="container-head">{{title}}</div>
</template>

<script>
export default {
    name: "my-header",
    computed: {
        title() {
            return this.$route.meta.title || "三扣一计分器";
        },
    },
};
</script>


<style lang="less" scoped>
.container-head {
    height: 100%;
    background: #509de3;
}
</style>

