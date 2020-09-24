const express = require('express')
const app = new express()
const City = require('./model/city')
const Movie = require('./model/movie')
var bodyParser = require('body-parser')

var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
})
var upload = multer({
  storage: storage
})
app.use('/uploads', express.static('uploads'))

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
app.get('/getCityLists', (req, res) => {
  City.find().then(mon => {
    res.json({
      code: 20000,
      list: mon,
      msg: '数据获取成功'
    })
  });
})

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


//上传图片接口
app.post('/upload', upload.single('avatar'), function (req, res, next) {
  res.json({
    code: 20000,
    msg: '图片上传成功',
    path: req.file.path
  })
})

//上传电影信息接口
app.post('/movie/create', (req, res) => {
  const movie = new Movie(req.body);
  movie.save().then(() => {
    res.json({
      code: 20000,
      msg: '上传成功'
    })
  })
})

//获取电影数据，分页
app.get('/getMovieList', async (req, res) => {
  const page = req.query.page || 1;
  const pagesize = req.query.pagesize || 3;
  const start = (Number(page) - 1) * Number(pagesize);
  const nums = Number(pagesize);
  const total = await Movie.find().populate('p');
  const result = await Movie.find().populate('p').skip(start).limit(nums);
  console.log(result);
  res.json({
    code: 20000,
    list: result,
    total: total.length
  })
})

//删除电影
app.delete('/deletemovie/:id', (req, res) => {
  Movie.findByIdAndRemove(req.params.id).then(mon => {
    res.json({
      code: 20000,
      msg: '成功删除数据'
    })
  })
})

//通过id查询数据
app.get('/getMovieDataById/:id', (req, res) => {
  Movie.findById(req.params.id).populate('p').then(mon => {
    res.json({
      code: 20000,
      data: mon
    })
  })
})

app.put('/movieEdit/:id', (req, res) => {
  // console.log(req.params.id);
  // console.log(req.body);
  Movie.findByIdAndUpdate(req.params.id, req.body).then(mon => {
    res.json({
      code: 20000,
      msg: '修改成功'
    })
  })
})

app.listen(8888, '127.0.0.1')
