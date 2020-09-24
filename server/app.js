const express = require('express')
const app = new express()
const City = require('./model/city')
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())




app.post('/user/login', function (req, res) {
  // req.session.token='加密算法生成随机token'
  // const data={"code":20000,"data":{"roles":["editor"],"token":req.session.token,"introduction":"I am a super administrator","avatar":"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif","name":"Super Admin"}}
  const data = {
    "code": 20000,
    "data": {
      "token": "asasasasas",
      "orangiseid": 'wwwwwwww',
      "introduction": "I am a super administrator",
      "avatar": "https://dgss0.bdstatic.com/5bVWsj_p_tVS5dKfpU_Y_D3/res/r/image/2020-09-22/7afe3efb3e8fb391539e4e821e9ece28.jpg",
      "name": "Super Admin"
    }
  }
  res.json(data)
})
app.get('/user/info', function (req, res) {
  const data = {
    "code": 20000,
    "data": {
      "roles": ["editor"],
      "introduction": "I am a super administrator",
      "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      "name": "Super Admin"
    }
  }
  res.json(data)
})
app.post('/user/logout', function (req, res) {
  res.json({
    "code": 20000,
    "message": "success"
  })
})

//添加数据
app.post('/city/create', (req, res) => {
  const city = new City({
    name: req.body.name,
    index: req.body.index
  })
  city.save().then(mon => {
    res.json({
      code: 20000,
      msg: '数据添加成功'
    })
  })
})

//获取全部数据
// app.get('/getCityList', (req, res) => {
//   City.find().then(mon => {
//     res.json({
// 		code:20000,
// 		list:mon,
// 		msg:'数据获取成功'
// 	})
//   });
// })

//获取数据，分页
app.get('/getCityList', async (req, res) => {
  const page = req.query.page || 1;
  const pagesize = req.query.pagesize || 3;
  const start = (Number(page) - 1) * Number(pagesize);
  const nums = Number(pagesize);
  const total = await City.find();
  const result = await City.find().skip(start).limit(nums);
  res.json({
    code: 20000,
    list: result,
    total: total.length
  })
})

//删除城市
app.delete('/deletecity/:id', (req, res) => {
  City.findByIdAndRemove(req.params.id).then(mon => {
    res.json({
      code: 20000,
      msg: '成功删除数据'
    })
  })
})

//通过id查询数据
app.get('/getDataById/:id', (req, res) => {
  City.findById(req.params.id).then(mon => {
    res.json({
      code: 20000,
      data: mon
    })
  })
})

//修改城市
app.post('/city/edit', (req, res) => {
  City.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    index: req.body.index
  }).then(mon => {
    res.json({
      code: 20000,
      data: mon,
      msg: '修改成功'
    })
  })
})


app.listen(8888, '127.0.0.1')
