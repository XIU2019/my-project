// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-a1vlk',
  traceUser: true
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var _id=event._id
  var category = event.category
  var description = event.description
  var fileIds = event.fileIds
  var goodName = event.goodName
  var price = event.price
  var score = event.score
  var stock = event.stock
  try {
    return await db.collection('good').doc(_id)
      .update({
        data: {
          category: category,
          description: description,
          fileIds: fileIds,
          goodName: goodName,
          price:price,
          score:score,
          stock:stock,
        },
      })
  } catch (e) {
    console.error(e)
  }

 
}