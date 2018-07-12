<template>
    <div class="container-scores">
        <p>
            <span class="mr">头包</span>
            <span class="mr">{{scores.first}}</span>
            <span class="mr" @click="edit('first')">修改</span>
        </p>
        <p>
            <span class="mr">二包</span>
            <span class="mr">{{scores.second}}</span>
            <span class="mr" @click="edit('second')">修改</span>
        </p>
        <p>
            <span class="mr">三包</span>
            <span class="mr">{{scores.third}}</span>
            <span class="mr" @click="edit('third')">修改</span>
        </p>
        <hr>
        <p>
            <span class="mr">头包台板费</span>
            <span class="mr">{{scores.tableFirst}}</span>
            <span class="mr" @click="edit('tableFirst')">修改</span>
        </p>
        <p>
            <span class="mr">二包台板费</span>
            <span class="mr">{{scores.tableSecond}}</span>
            <span class="mr" @click="edit('tableSecond')">修改</span>
        </p>
        <p>
            <span class="mr">三包台板费</span>
            <span class="mr">{{scores.tableThird}}</span>
            <span class="mr" @click="edit('tableThird')">修改</span>
        </p>
        <MyDialog :appendToBody="true" v-if="showDialog" @confirm="changeScore" @close="close" title="修改基础分数">
            <div class="ct">
                <input class="mt ipt" type="tel" ref="ipt">
            </div>
        </MyDialog>
    </div>
</template>

<script>
import MyDialog from "@/components/MyDialog";

export default {
    name: "set-score",
    components: {
        MyDialog,
    },
    props: {
        scores: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            showDialog: false,
            editing: null,
        };
    },
    methods: {
        edit(keyName) {
            this.editing = keyName;
            this.showDialog = true;
        },
        close() {
            this.editing = null;
            this.showDialog = false;
        },
        changeScore() {
            if (this.isAllowedSubmit) {
                const value = parseInt(this.$refs.ipt.value);
                this.scores[this.editing] = value;
            } else {
                alert(this.notAllowedSubmitReason);
            }
            this.close();
        },
    },
    computed: {
        notAllowedSubmitReason() {
            const value = parseInt(this.$refs.ipt.value);
            if (!Number.isInteger(value) || value < 0) {
                return "只能输入0或者正整数";
            }
            // copy一份避免污染
            const copy = { ...this.scores };
            // 假设合法，用反证法来看看有没有问题
            copy[this.editing] = value;
            if (copy.first <= copy.second || copy.second <= copy.third) {
                return "头包金额必须大于2包，2包必须大于3包";
            }
            if (
                copy.first * 3 <= copy.tableFirst ||
                copy.second * 3 <= copy.tableSecond ||
                copy.third * 3 <= copy.tableThird
            ) {
                return "台板费比赢得钱还多";
            }
            return "";
        },
        isAllowedSubmit() {
            return !this.notAllowedSubmitReason;
        },
    },
};
</script>

<style lang="less" scoped>
.container-scores {
    height: 100%;
    border-top: solid 1px transparent;
}
.ct {
    text-align: center;
}
.mt {
    margin-top: 3em;
}
.mr {
    margin-right: 3em;
}
.ipt {
    height: 3em;
    line-height: 3em;
}
</style>

