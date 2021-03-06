<template lang="pug">
  div.register-container
    h1 欢迎使用精益数据工作坊
    h2 Lean Data Discovery
    div.form-container
      h3 注册新账号
      div.line
        a-form-model(ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol")
          a-form-model-item(label="用户名" prop="username")
            a-input(v-model="form.username")
          a-form-model-item(label="邮箱" prop="email")
            a-input(v-model="form.email")
          a-form-model-item(label="密码" prop="password")
            a-input(v-model="form.password" type="password")
          a-form-model-item.register-button
            a-button(type="primary" @click="onSubmit") 注册
        p.to-login
          span 已有账号？请
            router-link(to='/login').login 登录
</template>

<script>
    import { Card, Input, Button, Checkbox } from 'ant-design-vue'
    import { register } from './service'

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
                }
            }
        },
        methods: {
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        register(this.form.username, this.form.email, this.form.password)
                            .then(() => {
                                this.$message.success('注册成功，请登录')
                                this.$router.push('/login')
                            })
                            .catch(error => this.$message.error(error))
                    } else {
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
        width: 452px;
        height: 1px;
        background-color: #dedede;
    }

    .form-container {
        width: 540px;
        height: 540px;
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

        .register-button {
            margin-top: 40px;
        }
    }

</style>
