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
            内容 2
          </van-tab>
        </van-tabs>
      </scroll-view>
    </view>
    <view class="foot">
      <view class="box1">
        <view>
          <van-icon v-if="selectAllStatus" color="#FF2426" size="23px" name="passed" @click="SelectedAll($event)"/>
          <van-icon v-else name="circle" size="23px" color="#FF2426" @click="SelectedAll($event)">全选</van-icon>
          <text>全选</text>
        </view>
      </view>
      <view class="box2" @click="limit">
        <text class="text" >设置限时打折</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    computed: {},
    onLoad: function () {
      this.getGoodList()
    },
    onShow: function () {
      this.getGoodList()
    },
    onReady() {
      this.getGoodList()
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
            // 缓存地址信息
            wx.setStorage({
              key: 'goodList',
              data: that.goodList,
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
            // console.log('goodList:', that.goodList);
          })
            .catch(err => {
              console.log(err)
            })
        }
      },
      limit(){
        // 转到菜品列表详情
          wx.navigateTo({
            url: "/pages/flashSale/main",
          })
      },
      // showPopup() {
      //   this.show = true;
      // },
      // onClose() {
      //   this.show = false;
      //
      // },
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
      SelectedAll(event) {
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
      //  设置折扣
      onChangeStep(event, id) {
        console.log(event.mp.detail, id);
        let discount = event.mp.detail;
        console.log(discount);
        this.goodList1.map(item => {
          if (item._id === id)
            return item.discount = discount
        });
      },
      // showPopupTime1() {
      //   this.showTime = true
      // },
      //     showPopupTime2() {
      //   this.showTime = true
      // },
      // onCloseTime(){
      //    this.showTime = false
      // },
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
</style>
