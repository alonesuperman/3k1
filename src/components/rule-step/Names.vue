<template>
    <div class="container-names">
        <ul>
            <li v-for="person in result" :key="person.name">
                <span>{{person.name}}</span>
                <span class="mr" @click="edit(person)">修改名字</span>
            </li>
        </ul>
        <MyDialog :appendToBody="true" v-if="showDialog" @close="closeEdit" @confirm="changeName" title="修改姓名">
            <div class="ct">
                <input class="mt ipt" type="text" ref="ipt">
            </div>
        </MyDialog>
    </div>
</template>

<script>
import Person from "@/js/Person";
import MyDialog from "@/components/MyDialog";

export default {
    name: "set-names",
    components: {
        MyDialog,
    },
    props: {
        persons: {
            type: Number,
            required: true,
        },
        names: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            result: [
                new Person("小辉"),
                new Person("张民"),
                new Person("龙"),
                new Person("胖子"),
            ],
            showDialog: false,
            editingPerson: null,
        };
    },
    created() {
        Person.clearAll();
        let i = 1;
        while (this.persons > this.result.length) {
            this.result.push(new Person(`无名${i}`));
            i++;
        }
    },
    methods: {
        edit(person) {
            this.editingPerson = person;
            this.showDialog = true;
        },
        closeEdit() {
            this.showDialog = false;
            this.editingPerson = null;
        },
        changeName() {
            if (this.editingPerson instanceof Person) {
                const isOk = this.editingPerson.changeName(
                    this.$refs.ipt.value
                );
                if (isOk) {
                    this.closeEdit();
                } else {
                    alert("名字有重复");
                }
            } else {
                alert("先选中人物");
            }
        },
    },
    beforeDestroy() {
        this.$emit("update:names", this.result);
    },
};
</script>

<style lang="less" scoped>
.container-names {
    height: 100%;
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
