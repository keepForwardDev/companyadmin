<style lang="less" scoped>
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :openKaptcha="openKaptcha" ref="LoginForm"></login-form>
          <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      openKaptcha: false
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password, kaptcha }) {
      this.handleLogin({ userName, password, kaptcha }).then(res => {
        if (res.data.code === 1) {
          this.$router.push({
            name: this.$config.homeName
          })
        } else {
          if (this.openKaptcha) {
            this.$refs.LoginForm.refresh()
          }
          if (res.data.data) {
            this.openKaptcha = true
          }
          this.$Notice.open({
            title: '提示',
            desc: res.data.msg,
            duration: 2
          })
        }
        /*this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })*/
      })
    }
  }
}
</script>

<style>

</style>
