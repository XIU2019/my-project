<template>
  <view class="body">
    <view class="main">
      <scroll-view scroll-y="true" style="height: 100%;" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
        <van-tabs v-bind:active="active" @change="onChangeTitle">
          <van-tab title="全部">
            <view v-for="(item, idx) in goodList"
                  :key="idx">
              <van-icon v-if="item.selected" size="23px" color="#FF0000" name="passed"
                        @click="onChangeSelected(item._id)"
                        v-bind:data-index="item.id"/>
              <van-icon v-else name="circle" size="23px" color="#FF0000" @click="onChangeSelected(item._id)"
                        v-bind:data-index="item.id"/>
              <van-card
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
                <!--              <view slot="footer">-->
                <!--             <van-checkbox name="item._id"/>-->
                <!--              </view>-->
              </van-card>

            </view>
          </van-tab>
          <van-tab title="限时打折">
            <view v-for="(item, idx) in saleList"
                  :key="idx">
              <van-cell>
                <view slot="title">
                  {{idx+1}}号
                </view>
                <view slot="right-icon" class="cell-value">
                  准备中
                </view>
              </van-cell>
              <van-card
                v-for="(item, index) in item.goodList"
                :key="index"
                v-bind:tag="item.discount"
                v-bind:num="item.stock"
                v-bind:origin-price="item.price"
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
              </van-card>
              <van-cell title=" 活动时间：" use-label-slot>
                <view slot="label">
                  <van-row>
                    <van-col span="8">{{item.startTime}}</van-col>
                    <van-col span="8">{{item.endTime}}</van-col>
                  </van-row>
                </view>
              </van-cell>
              <van-cell>
                <van-row>
                  <van-button type="default" size="small" @click="updateSale(item._id)">修改</van-button>
                  <van-button type="default" size="small" @click="removeSale(item._id)">删除</van-button>
                </van-row>
              </van-cell>
            </view>
          </van-tab>
        </van-tabs>
      </scroll-view>
    </view>
    <view class="foot">
      <view class="box1">
        <view>
          <van-icon v-if="selectAllStatus" color="#FF2426" size="23px" name="passed" @click="selectAll($event)"/>
          <van-icon v-else name="circle" size="23px" color="#FF2426" @click="selectAll($event)">全选</van-icon>
          <text>全选</text>
        </view>
      </view>
      <view class="box2" @click="limit">
        <text class="text">设置限时打折</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    computed: {},
    onLoad: function () {
      this.getGoodList();
      this.getSaleList();
    },
    onShow: function () {
      this.getGoodList();
      this.getSaleList();
    },
    onReady() {
      this.getGoodList();
      this.getSaleList();
    },
    data() {
      return {
        active: 0,
        password: '',
        goodList: [],
        goodList1: [],//选中的菜品信息表
        title: "",
        result: ['a', 'b'],
        selectAllStatus: true,//全选
        show: false,
        time: '',//活动时间
        showTime: false,
        saleList: [],//活动列表

      }
    },
    methods: {
      onChangeTime() {

      },
      upper(e) {
        // console.log(e)
      },

      lower(e) {
        // console.log(e)
      },

      scroll(e) {
        // console.log(e)
      },
      onChangeBox(event) {
        this.result = event.mp.delete
      },
      // 获取标题
      onChangeTitle(event) {
        console.log(event.mp.detail.title);
        this.title = event.mp.detail.title;
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
            that.goodList.map(item => {
              item.selected = true
            });
            this.goodList1 = this.goodList.filter(item => item.selected === true);
            // wx.setStorage({
            //   key: 'goodList',
            //   data: that.goodList,
            //   success(res) {
            //     console.log(res)
            //   }
            // })
            // 缓存地址信息
            wx.setStorage({
              key: 'goodList',
              data: this.goodList1,
              success(res) {
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
            //向数组中添加num字段
            that.goodList.map(item => {
              item.selected = true
            });
            this.goodList1 = this.goodList.filter(item => item.selected === true);
            // 缓存地址信息
            wx.setStorage({
              key: 'goodList',
              data: this.goodList1,
              success(res) {
                console.log(res)
              }
            })
            // console.log('goodList:', that.goodList);
          })
            .catch(err => {
              console.log(err)
            })
        }
      },
      limit() {
        // 转到菜品列表详情
        wx.navigateTo({
          url: "/pages/flashSale/main",
        })
      },
      //单选
      onChangeSelected(id) {
        this.selectAllStatus = false;
        const index = this.goodList.findIndex(item => item._id === id);
        const selected = this.goodList[index].selected;
        this.goodList[index].selected = !selected;
        this.$set(this.goodList, index, this.goodList[index]);
        this.goodList1 = this.goodList.filter(item => item.selected === true);
        // 缓存地址信息
        wx.setStorage({
          key: 'goodList',
          data: this.goodList1,
          success(res) {
            console.log(res)
          }
        })
      },
      //全选
      selectAll(event) {
        let selectAllStatus = this.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        let goodList = this.goodList;
        for (let i = 0; i < goodList.length; i++) {
          goodList[i].selected = selectAllStatus     // 改变所有商品状态
        }
        this.selectAllStatus = selectAllStatus;
        this.goodList = goodList;
        this.goodList1 = this.goodList.filter(item => item.selected === true);
        // 缓存地址信息
        wx.setStorage({
          key: 'goodList',
          data: this.goodList1,
          success(res) {
            console.log(res)
          }
        })
      },
      // 查询促销活动
      getSaleList() {
        const that = this;
        const db = wx.cloud.database();
        const good = db.collection('sale');
        good.get().then(res => {
          console.log(res);
          that.saleList = [];
          that.saleList = that.saleList.concat(res.data);
          // 缓存地址信息
          wx.setStorage({
            key: 'saleList',
            data: this.saleList,
            success(res) {
              console.log(res)
            }
          })
        })
          .catch(err => {
            console.log(err)
          })
      },
      //  修改信息
      updateSale(id) {
        console.log(id);
          wx.navigateTo({
          url: `/pages/updateSale/main?id=${id}`,
        })
      },
      //  删除活动信息
      removeSale(id) {

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

  .main {
    width: 100%;
    height: 92%;
    background: #ffffff;
    margin: 0 auto;
  }

  .foot {
    width: 100%;
    height: 8%;
    background: #ffffff;
    margin: 0px auto;
  }

  .box1 {
    width: 20%;
    height: 100%;
    float: left;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .box2 {
    width: 40%;
    height: 100%;
    float: right;
    background: #ff2624;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
  }

  .text {
    color: #e9e9e9;
    font-size: 18px;
  }

  .box {
    width: 100%;
    height: 100%;
    background: #c4c4c4;
  }

  .box3 {
    width: 100%;
    height: 10%;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .boxMain {
    width: 100%;
    height: 90%;
    background: #ffffff;
  }

  .cell-value {
    color: #ff2624 !important;
  }
</style>
