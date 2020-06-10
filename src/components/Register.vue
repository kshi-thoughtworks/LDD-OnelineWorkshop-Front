<template lang="pug">
  div.register-container
    h1 欢迎使用精益数据工作坊
    h2 Lean Data Discovery
    div.form-container
      h3 注册新账号
      div.line
        a-form-model(ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol")
          a-form-model-item(label="昵称" prop="username")
            a-input(v-model="form.username")
          a-form-model-item(label="邮箱" prop="email")
            a-input(v-model="form.email")
          a-form-model-item(label="密码" prop="password")
            a-input(v-model="form.password" type="password")
          a-form-model-item(prop="agree")
            a-checkbox(v-model="form.agree" value="1" name="type")
              p.agreement
                span 我已阅读并同意
                a 《LDD网络服务使用协议》
                span 和
                a 《LDD用户隐私条款》
          a-form-model-item
            a-button(type="primary" @click="onSubmit") 注册
        p.to-login
          span 已有账号？请
            a(href='/login').login 登录
</template>

<script>
    import {Card, Input, Button, Checkbox} from 'ant-design-vue';
    import axios from 'axios';

    export default {
        name: 'Register',
        components: {
            'a-card': Card,
            'a-input': Input,
            'a-button': Button,
            'a-checkbox': Checkbox,
        },
        data() {
            return {
                labelCol: {span: 24},
                wrapperCol: {span: 24},
                form: {
                    username: '',
                    email: '',
                    password: '',
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'change'},
                        {min: 4, max: 10, message: '用户名长度在4到10位', trigger: 'change'},
                        {pattern: '^[0-9a-zA-Z\u4e00-\u9fa5]+$', message: '仅可包含数字、字母、中文', trigger: 'change'}
                        ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'change'},
                        {pattern: '^\\S+@\\S+$', message: '请输入正确的邮箱格式', trigger: 'change'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'change'},
                        {min: 8, max: 20, message: '密码长度在8到20位', trigger: 'change'},
                        {pattern: '^(?![^a-zA-Z]+$)(?!\\D+$)', message: '有且必须包含数字、字母', trigger: 'change'}
                        ],
                    agree: [{required: true, message: '请勾选', trigger: 'change'}],
                }
            }
        },
        methods: {
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    console.log(this.form)
                    if (valid) {
                        let data = {
                            username: this.form.username,
                            email: this.form.email,
                            password: this.form.password
                        }
                        axios.post('/workshop/users/register', data)
                            .then(() => {
                                this.$message.success('注册成功，请登录')
                                this.$router.push('/login')
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

<style scoped lang="scss">
    .register-container {
        background-color: #37115a;
        background-image: url('../assets/lego-background.svg');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: left bottom;
        box-sizing: border-box;
        min-height: 100%;
        width: 100%;
        padding-top: 50px;
        padding-left: 26%;
    }

    h1, h2 {
        color: var(--white);
    }

    .line {
        height: 1px;
        background-color: #dedede;
    }

    .form-container {
        width: 540px;
        height: 620px;
        border-radius: 8px;
        box-shadow: 0 3px 20px 0 rgba(40, 29, 50, 0.4);
        background-color: var(--white);
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;

        h3 {
            font-size: 24px;
            font-weight: 600;
            color: var(--violet-blue);
            margin-top: 30px;
        }


        label {
            display: block;
            text-align: left;
            font-size: 14px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 10px;
        }

        .ant-input {
            width: 100%;
            height: 50px;
            border-radius: 4px;
            background-color: #f5f3f6;
            border: none;

        }


        .agreement {
            display: inline;
            text-align: left;
            margin: 35px 0;
            font-size: 14px;

            span {
                font-weight: 600;
                color: #000000;
            }

            a {
                color: var(--slate-grey);
            }
        }

        button {
            width: 100%;
            height: 50px;
            border-radius: 4px;
            border: none;
            background-color: var(--violet-blue);
            color: var(--white);
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 10px;
        }

        .ant-form-item {
            margin: 20px 0;
        }

        .to-login {
            text-align: center;
            font-size: 14px;
            color: var(--slate-grey);

            .login {
                font-weight: 600;
                color: var(--violet-blue);
            }
        }

        .has-error {
            .ant-input {
                border: 1px solid var(--pastel-red);
            }
        }
    }
</style>
