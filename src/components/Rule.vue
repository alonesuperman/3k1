<template>
    <div class="container-rule">
        <section class="choose-persons" v-show="step === 1">
            <div>选择人数</div>
            <hr>
            <div>
                <span style="margin-right:1em;" class="btn" :class="{selected:result.persons === persons}" v-for="persons in personList" :key="persons" @click="result.persons = persons">{{persons}}人</span>
            </div>
            <hr>
        </section>
        <section class="set-names" v-if="step === 2">
            <Names :persons="result.persons" :names.sync="result.names" />
        </section>
        <section class="foot">
            <span class="btn big" v-show="step>1" @click="--step">上一步</span>
            <span class="btn big" @click="++step">下一步</span>
        </section>
    </div>
</template>

<script>
import Names from "@/components/rule-step/Names.vue";

export default {
    name: "choose-rule",
    data() {
        return {
            // 当前步骤
            step: 1,
            personList: [4, 5, 6],
            result: {
                persons: 4,
                names: [],
            },
        };
    },
    components: {
        Names,
    },
};
</script>

<style lang="less" scoped>
@baseColor: #509de3;
.container-rule {
    height: 100%;
    position: relative;
    .btn {
        height: 3em;
        line-height: 3em;
        width: 3em;
        border-radius: 6px;
        border: solid 1px #ccc;
        cursor: pointer;
        display: inline-block;
        background: #fff;
        color: @baseColor;
        &.selected {
            background: @baseColor;
            color: #fff;
        }
        &.big {
            width: 6em;
        }
    }
    .foot {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
</style>

