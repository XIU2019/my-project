<template>
  <view class="body">
    <view class="top">
      <view v-for="(item, idx) in commentList" :key="idx">
        <van-cell v-bind:value="item.commentTime" icon="user-o">
          <view slot="title">
            <view class="van-cell-text">匿名用户
              <van-rate readonly size="10px" v-bind:value="item.score" @change="onChange"/>
            </view>
          </view>
        </van-cell>
        <van-cell>
          <van-row>
            <van-col class="text">
              人均 ￥: {{item.per_cost}}
            </van-col>
          </van-row>
          <van-row class="text">
            <van-col>评价内容：{{item.content}}</van-col>
          </van-row>
          <van-row>
            <van-grid column-num="3">
              <van-grid-item use-slot v-for="(item, index) in item.fileIds" :key="index">
                <img
                  style="width:80px; height: 80px;"
                  v-bind:src="item"
                />
              </van-grid-item>
            </van-grid>
          </van-row>
          <van-row class="reply">

          </van-row>
        </van-cell>
      </view>
    </view>
    <view class="main">
      <van-cell-group>
        <van-cell title="回复："/>
        <van-field
          v-bind:value="content"
          type="textarea"
          placeholder="快来回复用户评价！"
          v-bind:autosize=" { maxHeight: 200, minHeight: 100} "
          v-bind:border="false "
          @change="onChangeReply"
        />
      </van-cell-group>
    </view>
    <view class="foot">
      <text @click="submit">提交</text>
    </view>
  </view>
</template>

<script>

  export default {
    computed: {},
    onLoad: function (e) {
      console.log(e.id);
      Object.assign(this.$data, this.$options.data());//用于重新定义data的数据
      this.id = e.id;
      this.initComment();
    },
    onShow: function () {
      this.initComment();
    },
    onReady() {
      this.initComment();
    },
    data() {
      return {
        replyTime: '',
        commentList: [],//缓存的评价信息
        id: '',//评价ID
        reply: '',//回复内容
      }
    },
    methods: {
      onChangeReply(event) {
        this.reply = event.mp.detail
      },
      //  提交
      submit: function () {
        var that = this;
        const util = require('../../utils/index.js');
        this.replyTime = util.formatDate(new Date());
        console.log(this.replyTime);
        wx.showLoading({
          title: '提交中',
        });
        //  修改订单的售后状态
        that.updateStatus();

        // 转到订单详情
        wx.redirectTo({
          url: '/pages/commentList/main',
        });

      },
      //  修改订单的售后状态
      updateStatus() {
        const db = wx.cloud.database();
        db.collection('comment').doc(this.id).update({
          data: {
            replyStatus: '已回复',
            reply: this.reply,
            replyTime: this.replyTime,
          }
        }).then(res => {
          console.log(res);
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
          });
        })
          .catch(err => {
            console.log(err)
            wx.showToast({
              title: '提交失败',
            })
          })
      }
      ,
      //  初始化评价信息
      initComment() {
        let value = wx.getStorageSync('commentList');
        if (value) {
          this.commentList = value;
          console.log(value)
        } else {
          this.commentList = ''
        }
        this.commentList = this.commentList.filter(item => item._id === this.id)
      },
    },
  }
</script>

<style>
  .body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    background: #eeeeee;
  }

  .top {
    height: 46%;
    width: 100%;
    background: #ffffff;
    margin: 10px auto;
  }

  .main {
    width: 100%;
    height: 40%;
    background: #ffffff;
    margin: 10px auto;
  }

  .foot {
    width: 100%;
    height: 10%;
    background: #ff4d37;
    margin: 10px auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #eeeeee;
  }
.reply{
     width: 100%;
    height: 20px;
    background: #ff4d37;
    margin: 10px auto;
}
</style>
