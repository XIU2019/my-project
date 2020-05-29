<template>
  <view class="body">
    <view class="main">
      <van-tabs v-bind:active="active" @change="onChangeTitle">
        <van-tab title="全部">
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
              <van-row class="box" v-if="item.replyStatus===reply">
                商家回复:{{item.reply}}
              </van-row>
            </van-cell>
            <van-cell>
              <van-button plain hairline type="primary" color="red" size="small" v-if="item.replyStatus!==reply"
                          @click="goReply(item._id)">去回复
              </van-button>
              <van-dialog id="van-dialog"/>
            </van-cell>
          </view>
        </van-tab>
        <van-tab title="已回复">
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
              <van-row class="box">
                商家回复:{{item.reply}}
              </van-row>
            </van-cell>
          </view>
        </van-tab>

      </van-tabs>

    </view>
  </view>
</template>

<script>
  import Dialog from "../../../static/vant/dialog/dialog";

  export default {
    computed: {},
    onLoad(e) {
      this.getCommentList();
      Object.assign(this.$data, this.$options.data())
    },
    onShow() {
      this.getCommentList();
    },
    onReady() {
      this.getCommentList();
    },
    onUnload(){
  // wx.reLaunch({
  //         url: '/pages/my/main'
  //       })
    },
    data() {
      return {
        commentList: [],//评价列表
        active: 0,
        title: "",
        reply: '已回复',//判断是否回复
      }
    },
    methods: {
      getCommentList() {
        const that = this;
        const db = wx.cloud.database();
        const comment = db.collection('comment');
        if (that.title ==="已回复" ) {
          comment.where({
            replyStatus: that.title
          }).get().then(res => {
            console.log('1',res);
            that.commentList = [];
            that.commentList = that.commentList.concat(res.data);
            that.commentImages = that.commentList.fileIds;
            // 缓存地址信息
            wx.setStorage({
              key: 'commentList',
              data: that.commentList,
            });
          })
            .catch(err => {
              console.log(err)
            })
        } else {
          comment.get().then(res => {
            console.log(res);
            that.commentList = [];
            that.commentList = that.commentList.concat(res.data);
            that.commentImages = that.commentList.fileIds;
            // 缓存地址信息
            wx.setStorage({
              key: 'commentList',
              data: that.commentList,
            });
          })
            .catch(err => {
              console.log(err)
            })
        }
      },
      goReply(id) {
        console.log(id);
        wx.redirectTo({
            url: `/pages/reply/main?id=${id}`
          })
      },
      onChangeTitle(event) {
        console.log(event.mp.detail.title);
        this.title = event.mp.detail.title;
        this.getCommentList();
      },

    },

  }
</script>

<style>
  .cell-value {
    color: #ff2026 !important;
  }

  .cell-title {
    justify-content: center;
    align-items: center;
  }

  .body {
    height: 100%;
    width: 100%;
    background: #eeeeee;
  }

  .main {
    width: 100%;
    height: 100%;
    background: #ffffff;
    margin: 10px auto;
  }

  .text {
    font-size: 16px;
    line-height: 22px;

  }

  .box {
    float: left;
    height: auto;
    width: 100%;
    font-size: 15px;
    background: #f1f1f1;
    display: flex;
    flex-direction: row;
    justify-content: left;
    color: #535353;
  }

</style>
