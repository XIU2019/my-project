<template>
  <div class="body">
    <view class="main">
      <van-tabs v-bind:active=" active " @change="onChangeTitle">
        <van-tab title="全部">
          <view>
            <van-card
              v-for="(item, idx) in goodList"
              :key="idx"
              v-bind:tag="item.category"
              v-bind:num="item.stock"
              v-bind:price="item.price"
              v-bind:desc="item.description"
              v-bind:title="item.goodName"
              v-bind:thumb="item.fileIds"
              thumb-mode="aspectFit"
            >
              <view slot="tags">
                <text class="name ">自评</text>
                <van-icon name="star" color="yellow"/>
                {{item.score}}
              </view>
              <view slot="footer">
                <van-button size="mini" @click="update(item._id)">修改</van-button>
                <van-button size="mini" @click="deleted(item._id)">删除</van-button>
              </view>
            </van-card>
          </view>
        </van-tab>
        <van-tab title="早餐">
          <view>
            <van-card
              v-for="(item, idx) in goodList"
              :key="idx"
              v-bind:tag="item.category"
              v-bind:num="item.stock"
              v-bind:price="item.price"
              v-bind:desc="item.description"
              v-bind:title="item.goodName"
              v-bind:thumb="item.fileIds"
              thumb-mode="aspectFit"
            >
              <view slot="tags">
                <text class="name ">自评</text>
                <van-icon name="star" color="yellow"/>
                {{item.score}}
              </view>
              <view slot="footer">
                <van-button size="mini" @click="update(item._id)">修改</van-button>
                <van-button size="mini" @click="deleted(item._id)">删除</van-button>
              </view>
            </van-card>
          </view>
        </van-tab>
        <van-tab title="午餐">
          <view>
            <van-card
              v-for="(item, idx) in goodList"
              :key="idx"
              v-bind:tag="item.category"
              v-bind:num="item.stock"
              v-bind:price="item.price"
              v-bind:desc="item.description"
              v-bind:title="item.goodName"
              v-bind:thumb="item.fileIds"
              thumb-mode="aspectFit"
            >
              <view slot="tags">
                <text class="name ">自评</text>
                <van-icon name="star" color="yellow"/>
                {{item.score}}
              </view>
              <view slot="footer">
                <van-button size="mini" @click="update(item._id)">修改</van-button>
                <van-button size="mini" @click="deleted(item._id)">删除</van-button>
              </view>
            </van-card>
          </view>
        </van-tab>
        <van-tab title="晚餐">
          <view>
            <van-card
              v-for="(item, idx) in goodList"
              :key="idx"
              v-bind:tag="item.category"
              v-bind:num="item.stock"
              v-bind:price="item.price"
              v-bind:desc="item.description"
              v-bind:title="item.goodName"
              v-bind:thumb="item.fileIds"
              thumb-mode="aspectFit"
            >
              <view slot="tags">
                <text class="name ">自评</text>
                <van-icon name="star" color="yellow"/>
                {{item.score}}
              </view>
              <view slot="footer">
                <van-button size="mini" @click="update(item._id)">修改</van-button>
                <van-button size="mini" @click="deleted(item._id)">删除</van-button>
              </view>
            </van-card>
          </view>
        </van-tab>
      </van-tabs>
    </view>
    <view class="foot">
      <text class="text" @click="addGood">新增菜品</text>
    </view>
  </div>

</template>

<script>
  export default {
    computed: {},
    onLoad() {
      this.getGoodList();
    },
    onReady(){
      this.getGoodList();
    },
    onShow(){
         this.getGoodList();
    },
    data() {
      return {
        active: 0,
        goodList: [],
        clickTitle: "全部"
      }
    },
    methods: {
      onChangeTitle(event) {
        console.log(event.mp.detail.title);
        this.clickTitle = event.mp.detail.title;
        this.getGoodList();
      },
      //     获取列表
      getGoodList() {
        const that = this;
        const db = wx.cloud.database();
        const good = db.collection('good');
        if (that.clickTitle === '全部') {
          good.get().then(res => {
            console.log(res);
            that.goodList = [];
            that.goodList = that.goodList.concat(res.data);
            // console.log('goodList:', that.goodList)
            // 缓存地址信息
          wx.setStorage({
            key: 'goodList',
            data: that.goodList,
            success (res) {
              console.log(res)
            }
          })
          })
            .catch(err => {
              console.log(err)
            })
        } else if (that.clickTitle !== '全部' && that.clickTitle !== '') {
          good.where({
            category: that.clickTitle,
          })
            .get().then(res => {
            console.log(res);
            that.goodList = [];
            that.goodList = that.goodList.concat(res.data);
            // console.log('goodList:', that.goodList);
             // 缓存地址信息
          wx.setStorage({
            key: 'goodList',
            data: that.goodList,
            success (res) {
              console.log(res)
            }
          })
          })
            .catch(err => {
              console.log(err)
            })
        }
      },
      // 更新产品
      update(id) {
        console.log(id);
        wx.navigateTo({
          url: `/pages/updateGood/main?id=${id}`,
        })
      },
      //删除
      deleted(id) {
        console.log(id);
        const db = wx.cloud.database();
        const good = db.collection('good');
        good.doc(id).remove().then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        });
        this.getGoodList();
      },
      //  新增产品
      addGood() {
        wx.switchTab({
          url: '/pages/goodManage/main',
        })
      },
    },
  }
</script>

<style>
  .body {
    height: 100%;
    width: 100%;
    background: #e0eee4;
  }

  .main {
    height: 90%;
    width: 100%;
    background: #ffffff;
  }

  .foot {
    height: 10%;
    width: 100%;
    background: #ff2624;
    margin: 10px auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .text {
    color: #ffffff;
  }

  .name {
    color: #565656;
  }

  .Img {
    float: left;
  }


</style>
