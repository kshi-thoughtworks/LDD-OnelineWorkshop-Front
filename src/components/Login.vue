<template lang="pug">
  div.page
    div.panel-container
      h1 欢迎使用精益数据工作坊
      h2 Lean Data Discovery
      a-card(title="邮箱登录")
        a-form-model(:model="form" :label-col="labelCol" :wrapper-col="wrapperCol")
          a-form-model-item(label="昵称")
            a-input(v-model="form.username")
          a-form-model-item(label="密码")
            a-input(v-model="form.password" type="password")
          a-form-model-item(:wrapper-col="{ span: 14, offset: 4 }")
            a-button(type="primary" @click="onSubmit") 登录
</template>

<script>
    import { Card, Input, Button } from 'ant-design-vue';

    export default {
        name: 'Register',
        components: {
            'a-card': Card,
            'a-input': Input,
            'a-button': Button
        },
        data() {
            return {
                labelCol: {span: 4},
                wrapperCol: {span: 14},
                form: {
                    username: '',
                    email: '',
                    password: '',
                },
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!', this.form);
            },
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page {
        background-color: var(--violet-blue);
        background-image: url("../assets/images/lego-background.svg");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: left bottom;
        height: 100vh;
        overflow: auto;
    }

    h1, h2 {
        color: var(--white);
    }

    .panel-container {
        position: absolute;
        left: 50%;
        top: 20%;
    }
</style>
