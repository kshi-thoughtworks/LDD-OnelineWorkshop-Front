<template lang="pug">
  div.register-container
    h1 欢迎使用精益数据工作坊
    h2 Lean Data Discovery
    div.form-container
      h3 邮箱登录
      div.line
        a-form-model(ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol")
          a-form-model-item(label="邮箱/昵称" prop="name_or_email")
            a-input(v-model="form.name_or_email")
          a-form-model-item(label="密码" prop="password")
            a-input(v-model="form.password" type="password")
          p.forgot 忘记密码？
          a-form-model-item
            a-button(type="primary" @click="onSubmit") 登录
        p.to-login
            span 还没有账号？请
              router-link(to='/register').login 申请开通
</template>

<script>
    import { Input, Button } from 'ant-design-vue'
    import { login } from './service'

    export default {
        name: 'Register',
        components: {
            'a-input': Input,
            'a-button': Button
        },
        data() {
            return {
                labelCol: {span: 24},
                wrapperCol: {span: 24},
                form: {
                    name_or_email: '',
                    password: '',
                },
                rules: {
                    name_or_email: [
                        {required: true, message: '请输入邮箱或昵称', trigger: 'change'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'change'},
                        {min: 8, max: 20, message: '密码长度在8到20位', trigger: 'change'}
                    ],
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
                        login(this.form.name_or_email, this.form.password)
                            .then(() => {
                                this.$router.push('/workshops')
                            })
                            .catch(error => this.$message.error(error))
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
        width: 452px;
        background-color: #dedede;
    }

    .form-container {
        width: 540px;
        height: 470px;
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

        .forgot {
            float: right;
        }
    }
</style>
