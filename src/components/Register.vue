<template lang="pug">
  div.register-container
    h1 欢迎使用精益数据工作坊
    h2 Lean Data Discovery
    div.form-container
        h3 注册新账号
        div.line
        form
            label 昵称
            input(type='text').input-box
            label 邮箱
            input(type='email').input-box
            label 密码
            input(type='password').input-box
            p.agreement
                input(type='checkbox')
                span 我已阅读并同意
                a 《LDD网络服务使用协议》
                span 和
                a 《LDD用户隐私条款》
            input(type='submit' value='注册')
            p.to-login
                span 已有账号？请
                a.login 登录
</template>

<script>
    export default {
        name: 'Register'
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .register-container {
        background-color: #37115a;
        background-image: url('../assets/lego-background.svg');
        background-repeat: no-repeat;
        background-size: contain;
        box-sizing: border-box;
        min-height: 100%;
        width: 100%;
        padding-top: 50px;
    }
    h1, h2 {
        color: #ffffff;
    }
    .line {
        width: 560px;
        height: 1px;
        background-color: #dedede;
    }
    .form-container {
        width: 620px;
        height: 689px;
        border-radius: 8px;
        box-shadow: 0 3px 20px 0 rgba(40, 29, 50, 0.4);
        background-color: #ffffff;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;

        h3 {
            font-size: 24px;
            font-weight: 600;
            color: #6c0dbc;
        }
        form {
            width: 560px;
            label {
                display: block;
                text-align: left;
                font-size: 14px;
                font-weight: 600;
                margin-top: 30px;
                margin-bottom: 10px;
            }
            .input-box {
                width: 100%;
                height: 60px;
                border-radius: 4px;
                background-color: #f5f3f6;
                border: none;
            }
            .agreement {
                text-align: left;
                margin: 35px 0;
                font-size: 14px;
                span {
                    font-weight: 600;
                    color: #000000;
                }
                a {
                    color: #6d6e71;
                }
            }
            input[type=submit] {
                width: 100%;
                height: 50px;
                border-radius: 4px;
                border: none;
                background-color: var(--violet-blue);
                background: #6c0dbc;
                color: #ffffff;
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 10px;
            }
            .to-login {
                text-align: center;
                font-size: 14px;
                color: #6d6e71;
                .login {
                    font-weight: 600;
                    color: #6c0dbc;
                }
            }
        }
    }
</style>
