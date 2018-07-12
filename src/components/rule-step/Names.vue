<template>
    <div class="container-names">
        <ul>
            <li v-for="person in result" :key="person.name">
                <span>{{person.name}}</span>
                <span>修改名字</span>
            </li>
        </ul>
    </div>
</template>

<script>
import Person from "@/js/Person";

export default {
    name: "set-names",
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
        };
    },
    created() {
        let i = 1;
        while (this.persons > this.result.length) {
            this.result.push(new Person(`无名${i}`));
            i++;
        }
    },
};
</script>

<style lang="less" scoped>
.container-names {
    height: 100%;
}
</style>
