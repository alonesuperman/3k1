<template>
    <div class="container-playing">
        <div class="tabs">
            <div class="tab" :class="{selected:!showList}" @click="showList=false">只看结果</div>
            <div class="tab" :class="{selected:showList}" @click="showList=true">看历史数据</div>
            <div class="clear"></div>
        </div>
        <div class="list" v-if="error">
            <p>数据初始化错误</p>
            <router-link tag="p" to="/rule">重新设定</router-link>
        </div>
        <div class="list" v-else>
            <section v-show="!showList">
                <ul>
                    <li v-for="person in resultOnlyList" :key="person.name">
                        <span>{{person.name}}</span>
                        <span>分数:</span>
                        <span>{{person.score}}</span>
                    </li>
                    <hr>
                    <li class="taiban">
                        <span>台板</span>
                        <span>分数:</span>
                        <span>{{tableScore}}</span>
                    </li>
                </ul>
            </section>
            <section v-show="showList" class="h100">
                <div class="table-head">
                    <table cellspacing="0" cellpadding="0" border="0">
                        <colgroup>
                            <col :width="`${100/(configs.personCount+1)}%`" v-for="p in configs.persons" :key="p.name">
                            <!-- 还有一个台板 -->
                            <col :width="`${100/(configs.personCount+1)}%`">
                        </colgroup>
                        <thead>
                            <tr>
                                <th colspan="1" rowspan="1" v-for="person in resultOnlyList" :key="person.name">{{person.name}}</th>
                                <th colspan="1" rowspan="1">台板</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="table-body">
                    <table cellspacing="0" cellpadding="0" border="0">
                        <colgroup>
                            <col :width="`${100/(configs.personCount+1)}%`" v-for="p in configs.persons" :key="p.name">
                            <!-- 还有一个台板 -->
                            <col :width="`${100/(configs.personCount+1)}%`">
                        </colgroup>
                        <tbody>
                            <!-- turn指的是每局游戏，因为history是个二维数组 -->
                            <tr v-for="(turn,i) in history" :key="i">
                                <td colspan="1" rowspan="1" v-for="person in turn" :key="person.name">{{person.score}}</td>
                                <td colspan="1" rowspan="1">{{turn | getTableScoreForEachTurn}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
        <div class="footer" v-if="!error" @click="showDialog=true">计分/记账</div>
        <MyDialog :appendToBody="true" v-if="showDialog" title="计分/记账" @close="close" @confirm="calc">
            <div class="ct">
                <div>
                    <div>谁是庄?</div>
                    <div>
                        <span class="btn" v-for="person in configs.persons" :key="person.name" :class="{selected:banker === person}" @click="banker = person">{{person.name}}</span>
                    </div>
                </div>
                <div>
                    <div>庄输了还是赢了</div>
                    <div>
                        <span class="btn big" :class="{selected:bankerWasWon === true}" @click="bankerWasWon=true">庄赢了</span>
                        <span class="btn big" :class="{selected:bankerWasWon === false}" @click="bankerWasWon=false">庄输了</span>
                    </div>
                </div>
                <div>
                    <div>这把的类型是?</div>
                    <div>
                        <span class="btn" :class="{selected:category === 'first'}" @click="category = 'first'">头包</span>
                        <span class="btn" :class="{selected:category === 'second'}" @click="category = 'second'">二包</span>
                        <span class="btn" :class="{selected:category === 'third'}" @click="category = 'third'">三包</span>
                    </div>
                </div>
                <div v-if="isSomeoneTurnOff">
                    <div>谁轮空了?</div>
                    <div>
                        <!-- 要把庄过滤掉，一个人不可能既是庄又是轮空 -->
                        <span class="btn" v-for="person in configs.persons.filter(p=>p!==banker)" :key="person.name" :class="{selected:trunOffPersons.includes(person)}" @click="toggleTrunOffPerson(person)">{{person.name}}</span>
                    </div>
                </div>
            </div>
        </MyDialog>
    </div>
</template>

<script>
import Storage from "@/js/Storage";
import MyDialog from "@/components/MyDialog";

export default {
    name: "playing",
    components: {
        MyDialog,
    },
    data() {
        return {
            showList: false,
            /*
            这是大致造型
            configs: {
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
            */
            configs: null,
            error: null,
            // 历史记录
            history: [],
            showDialog: false,
            // dialog相关:庄家
            banker: null,
            // dialog相关:庄家的输赢,true表示赢了，false表示输了，null表示用户还没选择
            bankerWasWon: null,
            // dialog相关:包牌的类型
            category: null,
            // dialog相关:轮空人员
            trunOffPersons: [],
        };
    },
    created() {
        if (!this.checkConfigs()) {
            this.configs = Storage.load();
            if (this.checkConfigs()) {
                this.error = false;
            } else {
                this.error = true;
            }
        } else {
            this.error = false;
        }
        if (!this.error) {
            const oldHistory = Storage.loadHistory();
            if (oldHistory.length > 0) {
                this.history = oldHistory;
                // TODO: 检查历史最后一项和persons里的值匹不匹配
            } else {
                this.pushToHistory();
            }
        }
    },
    computed: {
        // 实际台板费
        tableScore() {
            // 先求所有人分数之和
            const total = this.resultOnlyList
                .map(p => p.score)
                .reduce((i, j) => i + j);
            return 0 - total;
        },
        // 是否需要计算轮空人员
        isSomeoneTurnOff() {
            return this.configs.personCount > 4;
        },
        // 给只看结果界面看的
        resultOnlyList() {
            return this.history.length > 0
                ? this.history[this.history.length - 1]
                : this.configs.persons;
        },
    },
    watch: {
        // 点击切换庄的时候要把轮空人员清掉
        banker(v, oldV) {
            if (v !== oldV) {
                this.trunOffPersons = [];
            }
        },
    },
    filters: {
        // 历史数据列表中台板计算方法
        getTableScoreForEachTurn(turn) {
            const total = turn.map(p => p.score).reduce((i, j) => i + j);
            return 0 - total;
        },
    },
    methods: {
        deepCopy(o) {
            return JSON.parse(JSON.stringify(o));
        },
        pushToHistory() {
            this.history.push(this.deepCopy(this.configs.persons));
            Storage.saveHistory(this.history);
        },
        checkConfigs() {
            if (!this.configs) {
                return false;
            }
            const { personCount, persons, scores } = this.configs;
            if (!personCount || !persons || !scores) {
                return false;
            }
            if (!Array.isArray(persons) || personCount !== persons.length) {
                return false;
            }
            return true;
        },
        toggleTrunOffPerson(person) {
            if (this.trunOffPersons.includes(person)) {
                this.trunOffPersons.splice(
                    this.trunOffPersons.indexOf(person),
                    1
                );
            } else {
                // 轮空人员数量不能大于总人数-4
                if (
                    this.trunOffPersons.length >=
                    this.configs.personCount - 4
                ) {
                    alert("哪来这么多轮空的，要增加先去掉一个");
                } else {
                    this.trunOffPersons.push(person);
                }
            }
        },
        // 将首字母变大写
        upperCaseFirstLetter(str) {
            if (typeof str === "string") {
                return str.substr(0, 1).toUpperCase() + str.substr(1);
            } else {
                throw new Error("参数错误");
            }
        },
        close() {
            this.banker = null;
            this.bankerWasWon = null;
            this.category = null;
            this.trunOffPersons = [];
            this.showDialog = false;
        },
        // 核心的算分方法
        calc() {
            // check轮空人员是否正确
            if (this.trunOffPersons.length !== this.configs.personCount - 4) {
                return alert("轮空人员信息错误");
            }
            // 检查bankerWasWon是否为布尔值
            if (typeof this.bankerWasWon !== "boolean") {
                return alert("庄家输赢信息错误");
            }

            // 得到在场上游戏的闲家
            const players = this.configs.persons.filter(person => {
                // 非庄且非轮空
                return (
                    this.banker !== person &&
                    !this.trunOffPersons.includes(person)
                );
            });
            // 对应的台板费的key
            const { category } = this;
            const tableKey = `table${this.upperCaseFirstLetter(category)}`;
            const { scores } = this.configs;
            // 庄赢了
            if (this.bankerWasWon) {
                // 庄进钱。闲家数量为3
                this.banker.score += scores[category] * 3 - scores[tableKey];
                // 闲扣钱
                players.forEach(player => {
                    player.score -= scores[category];
                });
            } else {
                // 庄家如果头家输了，扣钱也是和二包一样
                const reduceScore =
                    category === "first" ? scores["second"] : scores[category];
                // 庄扣钱
                this.banker.score -= reduceScore * 3;
                // 闲进钱
                players.forEach(player => {
                    player.score += reduceScore;
                });
            }
            // 推入历史纪录
            this.pushToHistory();
            this.close();
        },
    },
};
</script>


<style lang="less" scoped>
@baseColor: #509de3;
.container-playing {
    @tabsHeight: 3em;
    @footerHeight: 3em;
    height: 100%;
    .tabs {
        border-bottom: solid 1px #ccc;
        height: @tabsHeight;
        line-height: @tabsHeight;
        .tab {
            width: 50%;
            height: 100%;
            float: left;
            &:not(:first-of-type) {
                border-left: solid 1px #ccc;
            }
            &.selected {
                background: rgb(11, 177, 113);
                color: #fff;
            }
        }
    }
    .list {
        height: calc(~"100% - @{tabsHeight} - @{footerHeight}");
        overflow: hidden;
        .h100 {
            overflow: hidden;
            height: 100%;
            tr {
                height: 2em;
            }
            table {
                width: 100%;
            }
            @tableHeadHeight: 2em;
            .table-head {
                height: @tableHeadHeight;
                border-bottom: solid 1px rgb(26, 173, 13);
            }
            .table-body {
                height: calc(~"100% - @{tableHeadHeight}");
                overflow: auto;
            }
        }
    }
    .footer {
        height: @footerHeight;
        line-height: @footerHeight;
        background: orange;
        color: #fff;
    }
}
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
    margin-right: 0.3em;
    &.selected {
        background: @baseColor;
        color: #fff;
    }
    &.big {
        width: 6em;
    }
}
.ct {
    text-align: center;
}
</style>
