<template>
    <div class="container-rule">
        <section class="choose-persons" v-show="step === 1">
            <div>选择人数</div>
            <hr>
            <div>
                <span style="margin-right:1em;" class="btn" :class="{selected:result.personCount === count}" v-for="count in personList" :key="count" @click="result.personCount = count">{{count}}人</span>
            </div>
            <hr>
        </section>
        <section class="set-names" v-if="step === 2">
            <Names :personCount="result.personCount" :persons.sync="result.persons" />
        </section>
        <section class="set-scores" v-if="step === 3">
            <Scores :scores="result.scores" />
        </section>
        <section class="foot">
            <span class="btn big" v-show="step>1" @click="--step">上一步</span>
            <span class="btn big" @click="++step" v-if="step<maxStep">下一步</span>
            <span class="btn big" @click="finishConfig" v-if="step === maxStep">完成</span>
        </section>
    </div>
</template>

<script>
import Names from "@/components/rule-step/Names.vue";
import Scores from "@/components/rule-step/Scores.vue";
import Storage from "@/js/Storage";

export default {
    name: "choose-rule",
    data() {
        return {
            // 当前步骤
            step: 1,
            // 一共有几步
            maxStep: 3,
            personList: [4, 5, 6],
            result: {
                personCount: 4,
                persons: [],
                scores: {
                    first: 50,
                    second: 30,
                    third: 20,
                    // 台板费
                    tableFirst: 20,
                    tableSecond: 10,
                    tableThird: 0,
                },
            },
        };
    },
    components: {
        Names,
        Scores,
    },
    methods: {
        saveConfigs() {
            return Storage.save(this.result);
        },
        finishConfig() {
            if (this.saveConfigs()) {
                // 跳转去下一模块
                this.$router.replace("playing");
            }
        },
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
        padding-bottom: 0.5em;
    }
}
</style>

