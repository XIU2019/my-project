<template>
  <view>
    <van-tabs @change="onChangeTitle">
      <van-tab title="进行中">
        <view v-for="(item, index) in orderList"
              :key="index">
          <van-cell>
            <view slot="title">
              {{index+1}}号
            </view>
            <view slot="right-icon" class="cell-value">
              {{item.orderTypes}}
            </view>
          </van-cell>
          <van-cell>
            <van-row v-for="(item, _id) in item.goodList"
                     :key=" idx">
              <van-col span="6" offset="1">{{item.goodName}}</van-col>
              <van-col span="16">× {{item.num}}</van-col>
            </van-row>
            <van-row>
              <van-col span="6" offset="1">备注</van-col>
              <van-col span="16">{{item.orderInfo}}</van-col>
            </van-row>
            <van-row>
              <van-col span="24"> 实付￥{{item.totalMoney}}</van-col>
            </van-row>
            <van-row>
              <van-col span="24" class="cell-value" @click="oderDetail(item._id)">查看详情</van-col>
            </van-row>
          </van-cell>
          <van-cell>
            <van-row>
              <van-button type="default" size="small" @click="sendingOrder(item._id)"
                          v-if="item.orderTypes===text1&&send===false ">
                配送中
              </van-button>
              <van-button type="default" size="small" @click="overOrders" v-if="send===true && item.orderTypes===text1">
                订单完成
              </van-button>
              <van-button type="default" size="small" @click="waitingOrder(item._id)" v-if="item.orderTypes===text2">
                等待自取
              </van-button>
              <van-button type="default" size="small" @click="showPopup(item._id)" v-if="item.orderTypes===text2">
                核对取餐码
              </van-button>
              <van-popup v-bind:show="show" @close="onClose"
                         custom-style="width: 90%;height:20%">
                <view>
                  <view class="box2">
                    <van-cell-group>
                      <van-field
                        v-bind:value="mealCode"
                        label="取餐码:"
                        placeholder="请输入取餐码"
                        v-bind:error-message="errorMessage"
                        @change="onMealCode"
                      />
                    </van-cell-group>
                  </view>
                  <view class="box1">
                    <van-button type="default" size="small" @click="overOrders">订单完成</van-button>
                  </view>
                </view>
              </van-popup>
            </van-row>
          </van-cell>
        </view>
      </van-tab>
      <van-tab title="已完成">
        <view v-for="(item, index) in orderList"
              :key="index">
          <van-cell>
            <view slot="title">
              {{index+1}}号
            </view>
            <view slot="right-icon" class="cell-value">
              {{item.orderTypes}}
            </view>
          </van-cell>
          <van-cell>
            <van-row v-for="(item, _id) in item.goodList"
                     :key=" idx">
              <van-col span="6" offset="1">{{item.goodName}}</van-col>
              <van-col span="16">× {{item.num}}</van-col>
            </van-row>
            <van-row>
              <van-col span="6" offset="1">备注</van-col>
              <van-col span="16">{{item.orderInfo}}</van-col>
            </van-row>
            <van-row>
              <van-col span="24"> 实付￥{{item.totalMoney}}</van-col>
            </van-row>
            <van-row>
              <van-col span="24" class="cell-value" @click="oderDetail(item._id)">查看详情</van-col>
            </van-row>
          </van-cell>
          <van-cell>
            <van-row>
              <van-button type="default" size="small" @click="goComment(item._id)">查看评价</van-button>
            </van-row>
          </van-cell>
        </view>
      </van-tab>
      <van-tab title="已取消">
        <view v-for="(item, index) in orderList"
              :key="index">
          <van-cell>
            <view slot="title">
              {{index+1}}号
            </view>
            <view slot="right-icon" class="cell-value">
              {{item.orderTypes}}
            </view>
          </van-cell>
          <van-cell>
            <van-row v-for="(item, _id) in item.goodList"
                     :key=" idx">
              <van-col span="6" offset="1">{{item.goodName}}</van-col>
              <van-col span="16">× {{item.num}}</van-col>
            </van-row>
            <van-row>
              <van-col span="6" offset="1">备注</van-col>
              <van-col span="16">{{item.orderInfo}}</van-col>
            </van-row>
            <van-row>
              <van-col span="24"> 实付￥{{item.totalMoney}}</van-col>
            </van-row>
            <van-row>
              <van-col span="24" class="cell-value" @click="oderDetail(item._id)">查看详情</van-col>
            </van-row>
          </van-cell>
        </view>
      </van-tab>
    </van-tabs>
  </view>
</template>
<script>
  export default {
    onLoad() {
      this.getOrderList();
    },
    onShow() {
      this.getOrderList();
    },
    onReady() {
      this.getOrderList();
    },
    data() {
      return {
        orderList: [],
        selectedTitle: '商家接单',
        text1: "外卖配送",
        text2: "食堂自取",
        id: '',//订单ID
        show: false,
        errorMessage: '',
        mealCode: '',
        send: false,
        title: '',//配送中
      }
    },
    methods: {
      onMealCode(event) {
        this.mealCode = event.mp.detail;
        const index = this.orderList.findIndex(item => item._id === this.id);
        console.log(index);
        console.log(this.orderList[index].mealCode);
        if (this.orderList[index].mealCode === this.mealCode) {
          this.errorMessage = "验证成功"
        } else {
          this.errorMessage = "验证失败"
        }
      },
      showPopup(id) {
        console.log(id);
        this.id = id;
        this.show = true;
      },

      onClose() {
        this.show = false;
      },
      //获取栏目的内容
      onChangeTitle(event) {
        console.log(event.mp.detail.title);
        let selectedTitle = event.mp.detail.title;
        if (selectedTitle === "进行中") {
           for (let i = 0; i < this.orderList.length; i++) {
            let orderStatus = this.orderList[i].orderStatus;
            if (orderStatus === "商家接单") {
              this.selectedTitle = "商家接单";
              console.log(this.selectedTitle);
            } else if (orderStatus === "配送中") {
              this.selectedTitle = "配送中";
            }
          }
        } else if (selectedTitle === "已完成") {
          this.selectedTitle = "订单完成";
          this.getOrderList()
        } else {
          this.selectedTitle = "订单取消";
          this.getOrderList();
        }
      },
//     获取列表
      getOrderList() {
        const that = this;
        const db = wx.cloud.database();
        const order = db.collection('order');
        order.where({
          orderStatus: that.selectedTitle
        }).get().then(res => {
          console.log(res);
          that.orderList = res.data;
             for (let i = 0; i < this.orderList.length; i++) {
            let orderStatus = this.orderList[i].orderStatus;
            if (orderStatus === "商家接单") {
              this.selectedTitle = "商家接单";
              console.log(this.selectedTitle);
            } else if (orderStatus === "配送中") {
              this.selectedTitle = "配送中";
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //  查看订单详情
      oderDetail(id) {
        console.log(id);
        wx.redirectTo({
          url: `/pages/orderDetail/main?order_id=${id}`,
        })
      },
      //去查看评价
      goComment() {
        wx.redirectTo({
          url: '/pages/commentList/main',
        })
      },
      //修改订单状态为配送中
      sendingOrder(id) {
        console.log(id);
        const db = wx.cloud.database();
        db.collection('orderAdmit').where({orderId: id})
          .update({
              data: {
                orderStatus: '配送中',
              }
            }
          ).then(res => {
          this.send = true;
          console.log(res)
        }).catch(err => {
          console.log(err)
        });
        db.collection('order').where({_id: id})
          .update({
              data: {
                orderStatus: '配送中',
              }
            }
          ).then(res => {
          console.log(res);
          this.send = true;
        }).catch(err => {
          console.log(err)
        });

      },
      //修改订单状态为等待自提
      waitingOrder(id) {
        console.log(id)
        const db = wx.cloud.database();
        db.collection('orderAdmit').where({orderId: id})
          .update({
              data: {
                orderStatus: '等待自提',
              }
            }
          ).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        });
        db.collection('order').where({_id: id})
          .update({
              data: {
                orderStatus: '等待自提',
              }
            }
          ).then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
      },
      //修改订单状态为完成订单
      overOrders() {
        // console.log(id)
        const id = this.id;
        const db = wx.cloud.database();
        db.collection('orderAdmit').where({orderId: id})
          .update({
              data: {
                orderStatus: '订单完成',
              }
            }
          ).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        });
        db.collection('order').where({_id: id})
          .update({
              data: {
                orderStatus: '订单完成',
              }
            }
          ).then(res => {
          console.log(res);
          this.getOrderList();
          this.show = false;
        }).catch(err => {
          console.log(err)
        });
      },
    },
  }
</script>
<style scoped>
  .contain {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .cell-value {
    color: #ff2624 !important;
  }

  .box2 {
    width: 100% !important;
    height: 50% !important;
  }

  .box1 {
    width: 100% !important;
    height: 50% !important;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
