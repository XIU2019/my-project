<template>
  <div class="userContainer">
    <div class="user">
      <div class="userImg">
        <div v-if="isLogin">
        </div>
        <div v-else>
          <van-image width="100" height="100" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
        </div>
      </div>
      <div class="userName">
        <p class="userName">
          管理员XIU2020
        </p>
      </div>
      <div class="main">
        <van-grid column-num="2">
          <van-grid-item icon="contact" text="用户查询"/>
          <van-grid-item icon="orders-o" text="订单查询"/>
          <van-grid-item icon="records" text="评价管理" @click="commentList"/>
          <van-grid-item icon="notes-o" text="菜品管理" @click="goodManage"/>
          <van-grid-item icon="photo-o" text="轮播图管理"/>
          <van-grid-item icon="coupon-o" text="活动设置" @click="activities"/>
        </van-grid>

        <!--        退出登录-->
        <div class="userLogIn">
          <a @click="LoginOut">退出登陆</a>
          <!--          <navigator open-type="exit" target="miniProgram" class="userLogIn">-->
          <!--           退出登陆</navigator>-->
          <van-dialog id="van-dialog" confirm-button-color="#FF2620"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Dialog from '../../../static/vant/dialog/dialog'

  export default {
    computed: {},
    onLoad: function (e) {
      Object.assign(this.$data, this.$options.data());//用于重新定义data的数据
      this.isLogin = false
    },
    onShow: function () {

    },
    onReady() {

    },
    data() {
      return {
        isLogin: true,   //用于视图的判断    如果true则显示登陆注册按钮，false则显示用户信息

      }
    },
    methods: {
      login() {
        wx.redirectTo({
          url: '/pages/login/main'
        })
      },
      LoginOut() {
        var that = this
        Dialog.confirm({
          title: '确定退出',
          message: '退出登录后将无法查看订单，重新登录即可查看'
        }).then(() => {
          // on confirm
          that.isLogin = true
        }).catch(() => {
          // on cancel
        })
      },
      goodManage() {
        wx.navigateTo({
          url: '/pages/productList/main',
        })
      },
      activities(){
             wx.navigateTo({
          url: '/pages/saleList/main',
        })
      },
      commentList(){
          wx.navigateTo({
          url: '/pages/commentList/main',
        })
      },
    },
  }
</script>

<style>
  .main {
    width: 100%;
    height: 200px;
    margin-top: 10px;
    background: #ffffff;
  }

  .userLogIn {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 20px;
  }
</style>
