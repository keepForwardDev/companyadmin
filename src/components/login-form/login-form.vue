<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="kaptcha" v-if="openKaptcha">
      <img :src="kaptchaSrc" alt="换一张" style="padding-left: 10px;cursor: pointer" @click="refresh" id="kaptcha">
      <Input v-model="form.kaptcha" placeholder="请输入验证码" style="width: 140px;float: left;" size="large">
        <span slot="prepend">
          <Icon :size="16" type="ios-image"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
  import config from '@/config'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    kaptchaRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    },
    openKaptcha: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: '',
        kaptcha: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        kaptcha: this.kaptchaRules
      }
    },
    kaptchaSrc() {
      const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : ''

      return baseUrl + config.kaptchaUrl
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            kaptcha: this.form.kaptcha
          })
        }
      })
    },
    refresh() {
      document.getElementById("kaptcha").src= this.kaptchaSrc+ '?v='+new Date().getTime()
    }
  }
}
</script>
