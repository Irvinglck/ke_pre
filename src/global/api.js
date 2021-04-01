// 接口配置

// 把全体接口封装在的前端配置文件（序号与接口文档一一对应），多个环境配置时可快速切换整站式的全部接口，不用逐个页面去改。
const config = require('../../config');

const url = {
  apiUrl: '/ccp-web/api', // 接口路径
    // ctxPath: "/ccp-web/dist", //tomcat服务dist目录
  ctxPath: '/dist', // node服务dist目录

    // staticPath:config.dev.staticPath,       //开发环境静态资源路径
    // 条件 ? 结果1 : 结果2 //三元运算符，表示条件为true时，等式的结果就为结果1（'./'），否则为结果2('/static/')。
    // development为开发环境（npm run dev），另外一个production是生产环境（）
    // 生产环境时staticPath的值为'./'，开发环境时staticPath的值为'/static/'。
  staticPath: process.env.NODE_ENV !== 'development' ? config.build.staticPath : config.dev.staticPath
};

// ----------------请注意：如果正式环境，不需要本地json数据模拟，请删除以上代码和api中的模拟接口。----------------

const nodeApiBaseUrl = 'http://localhost:3000';

//柯尼卡
const kmUrl = 'http://localhost:8080';

export const api = {

            // 'login':'http://localhost:80/dataJson/login.json',//ngxin
  login: url.staticPath + '/dataJson/login.json', // 登录模拟接口，正式环境请删除
  getUserInfo: url.staticPath + '/dataJson/userInfo.json', // 获取登录用户模拟接口
  tableList: url.staticPath + '/dataJson/tableList.json', // 表格模拟接口
  getForm: url.staticPath + '/dataJson/form.json', // 表单模拟接口
  roleAndUser: url.staticPath + '/dataJson/roleAndUser.json',  // 获取角色和对应用户
  getMenuAndElement: url.staticPath + '/dataJson/getMenuAndElement.json',  // 获取用户的 菜单和元素权限


            // "in_theaters":url.staticPath+"/dataJson/in_theaters.json",  //获取电影列表,json
  in_theaters: '/v2/movie/in_theaters',  // 获取电影列表
  movieSearch: '/v2/movie/search',       // 电影搜索

            // 以下接口为实际接口，需要下载node项目源码
  addStudents: nodeApiBaseUrl + '/api/addStudents',       // 学生信息添加
  studentUpdate: nodeApiBaseUrl + '/api/studentUpdate',   // 学生信息修改
  studentList: nodeApiBaseUrl + '/api/queryStudents',     // 学生信息列表
  delStudents: nodeApiBaseUrl + '/api/delStudents',       // 学生信息删除
  queryStudentsItem: nodeApiBaseUrl + '/api/queryStudentsItem',     // 学生单条详情


  kmBanner:kmUrl+"/bsm/getBanner",//banner列表
  delBanner:kmUrl+"/bsm/delBanner",//删除banner
  uploadFileByType:kmUrl+"/bsm/uploadFileByType",//添加banner上传文件/上传新闻
  proList:kmUrl+"/bsm/getProInfos",//获取产品列表
  delPro:kmUrl+"/bsm/delPro",//删除单个文件
  addPro:kmUrl+"/bsm/addPro",//删除单个文件
  uploadFiles:kmUrl+"/bsm/uploadFiles",//产品参数图片上传
  getProImgs:kmUrl+"/bsm/getProImgs",//产品参数图片列表
  creatPdfUp:kmUrl+"/wx/creatPdfUp",//根据图片生成pdf
  updateInfo:kmUrl+"/bsm/updateInfo",//删除产品列表的图片
  updatePro:kmUrl+"/bsm/updatePro",//修改产品属性
  getNewsList:kmUrl+"/bsm/getNews",//获取新闻列表
  delNews:kmUrl+"/bsm/delNews",//删除新闻
  getUsers:kmUrl+"/bsm/getUsers",//获取用户列表
  delUser:kmUrl+"/bsm/delUser",//删除新闻

}


// export default api
