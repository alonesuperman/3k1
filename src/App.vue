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

export default {
    name: "App",
    components: {
        myHeader,
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
