<template>
    <div id="app">
        <header id="_header_">
            <myHeader/>
        </header>
        <div id="_mainBody_">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import myHeader from "./components/Header";
import Storage from "@/js/Storage";

export default {
    name: "App",
    components: {
        myHeader,
    },
    mounted() {
        const configs = Storage.load();
        const history = Storage.loadHistory();
        if (!configs && history.length === 0) {
            this.$router.replace({ name: "rule", query: {} });
        } else if (configs && history.length > 0) {
            this.$router.replace({ name: "playing", query: {} });
        } else {
            alert("有残余垃圾数据");
        }
    },
};
</script>

<style lang="less">
@headerHeight: 3rem;
html,
body,
ul,
li {
    margin: 0;
    padding: 0;
}
html,
body,
ul {
    height: 100%;
}
a {
    text-decoration: none;
}
ul,
li {
    list-style: none;
}
.clear {
    clear: both;
}
* {
    box-sizing: border-box;
}
img {
    border: none;
}
#app {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
#_header_ {
    height: @headerHeight;
    line-height: @headerHeight;
}
#_mainBody_ {
    height: calc(~"100% - @{headerHeight}");
}
</style>
