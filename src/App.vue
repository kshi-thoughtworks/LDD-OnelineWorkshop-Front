<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>

    export default {
        name: 'App'
    }
</script>

<style lang="scss">
    @import './assets/styles/variables.css';

    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
    }

    p {
        margin: 0;
        word-break: break-all;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        height: 100%;
        width: 100%;

        .ant-form-explain {
          position: absolute;
          right: 0;
          padding-top: 8px;
        }


        .ant-form-item-required::before {
          content: none;
        }
    }
</style>
