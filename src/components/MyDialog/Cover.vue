<template>
    <transition name="fade">
        <div class="fullScreenCover">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
export default {
    name: "fullScreenCover",
    props: {
        appendToBody: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            closed: false,
        };
    },
    mounted() {
        if (this.appendToBody) {
            document.body.appendChild(this.$el);
        }
    },
    destroyed() {
        // if appendToBody is true, remove DOM node after destroy
        if (this.appendToBody && this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
    },
};
</script>

<style lang="less" scoped>
.fullScreenCover {
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>

