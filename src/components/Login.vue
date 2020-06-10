<template lang="pug">
  div.page
    div.panel-container
      h1 欢迎使用精益数据工作坊
      h2 Lean Data Discovery
      a-card(title="邮箱登录")
        a-form-model(ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol")
          a-form-model-item(label="邮箱/昵称")
            a-input(v-model="form.name_or_email")
          a-form-model-item(label="密码")
            a-input(v-model="form.password" type="password")
          a-form-model-item(:wrapper-col="{ span: 14, offset: 4 }")
            a-button(type="primary" @click="onSubmit") 登录
</template>

<script>
    import { Card, Input, Button } from 'ant-design-vue';
    import axios from 'axios';

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
                    name_or_email: '',
                    password: '',
                },
                rules: {
                    name_or_email: [{required: true, message: '请输入邮箱或昵称', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                }
            }
        },
        methods: {
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    console.log(this.form)
                    if (valid) {
                        let data = {
                            name_or_email: this.form.name_or_email,
                            password: this.form.password
                        }
                        axios.post('/workshop/users/login', data)
                            .then(() => {
                                alert('submit!')
                            })
                            .catch(error => this.$message.error(error.response.data))
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
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
