<!--
    属性：自己看props，太多了，懒得写
    事件：
    close 请求父组件将其关闭 无返回
    confirm 用户点击了默认的确定按钮 无返回
-->

<template>
    <Cover :appendToBody="appendToBody">
        <!-- 包一层外层做阴影 内层overflow:hidden避免溢出 -->
        <div class="wrapper" :style="containerStyle">
            <div class="dialog-container" :style="containerStyle">
                <div class="header" :style="headerStyle">
                    <slot name="header">
                        <div class="default-slot-header" v-if="title">{{title}}</div>
                    </slot>
                </div>
                <div class="body" :style="bodyStyle">
                    <slot></slot>
                </div>
                <div class="footer" :style="footerStyle">
                    <slot name="footer">
                        <div class="default-slot-footer">
                            <span class="btn" @click="closeDialog">取消</span>
                            <span class="btn blue" @click="confirm">确定</span>
                        </div>
                    </slot>
                </div>
            </div>
        </div>
    </Cover>
</template>

<script>
import Cover from "./Cover.vue";

export default {
    name: "MyDialog",
    props: {
        appendToBody: {
            type: Boolean,
            default: false,
        },
        width: {
            type: Number,
            default: 300,
        },
        height: {
            type: Number,
            default: 380,
        },
        borderRadius: {
            type: Number,
            default: 6,
        },
        title: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            defaultValue: {
                headerHeight: 50,
                footerHeight: 50,
            },
        };
    },
    computed: {
        containerStyle() {
            return `width:${this.width}px;height:${
                this.height
            }px;border-radius:${this.borderRadius}px`;
        },
        //根据插槽计算头部高度
        headerHeight() {
            const { header } = this.$slots;
            return header || this.title ? this.defaultValue.headerHeight : 0;
        },
        headerStyle() {
            const h = this.headerHeight;
            return `height:${h}px;line-height:${h}px`;
        },
        footerHeight() {
            return this.defaultValue.footerHeight;
        },
        footerStyle() {
            const h = this.footerHeight;
            return `height:${h}px;line-height:${h}px`;
        },
        //根据头部和底部计算body高度
        bodyStyle() {
            const { headerHeight, footerHeight } = this;
            return `height:calc(100% - ${headerHeight}px - ${footerHeight}px)`;
        },
    },
    methods: {
        closeDialog() {
            this.$emit("close");
        },
        confirm() {
            this.$emit("confirm");
        },
    },
    components: {
        Cover,
    },
};
</script>

<style lang="less" scoped>
@baseColor: #509de3;
.wrapper {
    box-shadow: 0px 2px 6px 3px rgba(80, 80, 80, 0.8);
    position: absolute;
    left: 50%;
    top: 50%;
    border: solid 1px #eee;
    transform: translate(-50%, -50%);
}
.dialog-container {
    overflow: hidden;
    background-color: #fff;
    position: relative;
    .header {
        color: #333;
        font-size: 16px;
        position: relative;
        .default-slot-header {
            height: 100%;
            line-height: 50px;
            text-align: center;
            border-bottom: solid 1px #d8d8d8;
        }
    }
    .body {
        position: relative;
        font-size: 14px;
        color: #333;
    }
    .footer {
        color: #7f7f7f;
        position: relative;
        font-size: 14px;
        background-color: #eef1f6;
        .default-slot-footer {
            height: 100%;
            text-align: center;
            .justify_fix {
                display: inline-block;
                width: 100%;
                height: 0;
                overflow: hidden;
            }
            .btn {
                display: inline-block;
                width: 80px;
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                vertical-align: middle;
                background-color: #fff;
                text-align: center;
                border: solid 1px #d8d8d8;
                &:not(:first-of-type) {
                    margin-left: 80px;
                }
                &.blue {
                    background-color: @baseColor;
                    color: #fff;
                    border-color: @baseColor;
                }
            }
        }
    }
}
</style>

