<template>
    <div class="app-container">
        <!--        <h2 style="color:red">-->
        <!--           产品管理页面-->
        <!--        </h2>-->

        <!-- 搜索条件 -->
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="搜索新闻"
                      v-model="listQuery.name">
            </el-input>


            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" @click="handleCreate" icon="edit">添加新闻</el-button>
            <!--<el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button>-->
           <!--<el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>-->

        </div>


        <!-- 表格 v-loading.body="listLoading"-->
        <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="list"
                  element-loading-text="拼命加载中" border fit highlight-current-row>
            <el-table-column type="selection" width="50">
            </el-table-column>

            <el-table-column align="center" label='序号' width="70">
                <template slot-scope="scope">
                    {{ scope.$index+1 }}
                </template>
            </el-table-column>

            <el-table-column label="图片"  align="center" width="100px" prop="rating.average">
                <template slot-scope="scope">
                    <el-image :src="scope.row.titleUrl"/>
                </template>
            </el-table-column>

            <el-table-column label="时间" width="" align="center">
                <template slot-scope="scope">
                    {{scope.row.createTime}}
                </template>
            </el-table-column>
            <el-table-column label="新闻标题" width="" prop="title">
                <template slot-scope="scope">
                    {{scope.row.title}}
                </template>
            </el-table-column>
            <el-table-column label="新闻副标题" width="" prop="subtitle">
                <template slot-scope="scope">
                    {{scope.row.subtitle}}
                </template>
            </el-table-column>
            <el-table-column label="地址链接" width="" prop="title" >
                <template slot-scope="scope">
                    {{ scope.row.nurl}}
                </template>
            </el-table-column>




            <el-table-column align="center" label="操作" width="150px">
                <template slot-scope="scope">
                    <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.currPage"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!--上传产品详情文件-->
        <el-dialog title="添加产品详情" :visible.sync="detailProDialog">
            <div id="text">
                <el-form ref="form" :model="newData" label-width="80px" label-position="right" size="mini">
                    <el-form-item label="上传文件" prop="name">
                        <el-upload
                                ref="upload"
                                multiple
                                name="File"
                                action=""
                                :auto-upload="false"
                                accept=".dll, .DLL, .xml, .XML, .jpg, .jepg, .png"
                                :http-request="httpRequest"
                                :on-remove="removeImgs"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <span slot="tip" class="el-upload__tip" style="color: red">&nbsp;
                                &nbsp;&nbsp;注意上传.jpg.jepg .png结尾的图片,最多上传8张
                            </span>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="参数描述" prop="proName" style="width: 500px">
                        <el-input v-model="newData.proName"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="uploadFiles()" size="mini">确 定</el-button>
                    <el-button @click="cancelDialog" size="mini">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 新增弹窗 -->
        <el-dialog title="新增产品" :visible.sync="dialogFormVisible">
            <el-form class="small-space" :model="news" label-position="left" label-width="70px"
                     style='width: 400px; margin-left:50px;'>

                <el-form-item label="标题">
                    <el-input v-model="news.title"></el-input>
                </el-form-item>
                <el-form-item label="副标题">
                    <el-input v-model="news.subtitle"></el-input>
                </el-form-item>
                <el-form-item label="新闻地址">
                    <el-input v-model="news.nurl"></el-input>
                </el-form-item>
                <!--<el-form-item label="选择banner图片" :label-width="formLabelWidth">-->
                <el-form-item label="标题图片" >
                    <el-upload
                            class="upload-demo"
                            drag
                            :auto-upload="false"
                            :on-change="checkType"
                            action="none"
                            :show-file-list="flag"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip" style="color: red;">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>

                <el-button type="primary" @click="addNews">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
  import { api } from 'src/global/api';

  export default {
    data() {
      return {

        list: null, // 表格list
        total: null,
        listLoading: true,
        listQuery: {
          currPage: 1,
          pageSize: 10,
          name: '',
          type: null// 类型
        },
        news: {
          id:'',
          newId: '',
          title: '',
          subtitle: '',
          nurl: '',
          titleUrl: '',
          createTime:'',
        },
        typeOptions: [
          { key: '001', display_name: '类型1' },
          { key: '002', display_name: '类型2' },
          { key: '003', display_name: '类型3' }

        ],
        dialogFormVisible: false,
        form: {
          name: ''
        },
        detailProDialog:false,
        multipleSelection: [],
        newData: {},
        file: [],
        flag:true,
        idAttr:'',//产品id
        imgFile: null,
        fileList:null


      }
    },
    mounted() {
      const vm = this;
      vm.getList();
    },
    methods: {
      //选中文件钩子函数,可以在这里做文件限制操作
      checkType(file, fileList) {
        console.log('file', file)
        console.log('fileList', fileList)
        this.imgFile = file;
        // this.imgFile.push(file);
        this.fileList.push(file)
      },
      //多文件上传
      httpRequest(param) {
        this.file.push(param.file);// 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      },
      // 多文件上传
      uploadFiles() {
        var that=this;
        var upData = new FormData();
        this.$refs.upload.submit();// 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
        this.file.forEach(function(file) {// 因为要上传多个文件，所以需要遍历
          upData.append('files', file, file.name);
          // upData.append('file', this.file); //不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
        })
        this.newData.idAttr=that.idAttr;
        upData.append('proDes', JSON.stringify(this.newData)) // 这里需要转换一下格式传给后台

        this.axios.post(api.uploadFiles, upData)
          .then(function(succ) {
            console.log(succ.data)
            if (succ.data.code == 200) {
              console.log("上传成功")
              that.file=[];
              that.removeImgs();
              that.detailProDialog=false;
              that.getList();
              that.idAttr='';
              that.newData.proName=''
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      cancelDialog(){
        this.file=[];
        this.removeImgs();
        this.detailProDialog=false;
        this.idAttr='';
        this.newData.proName=''
      },
      removeImgs(){
        this.$refs.upload.clearFiles();
      },
      // 获取列表数据
      async getList() {
        const vm = this;
        vm.listLoading = false;
        // 请求参数
        const par = {
          pageSize: vm.listQuery.pageSize,
          startIndex: (vm.listQuery.currPage - 1) * vm.listQuery.pageSize,
          title: vm.listQuery.name,         // 新闻标题
          // tag: vm.listQuery.type       // 类型
        };
        //获取产品列表
        this.axios.get(api.getNewsList, { params: par }).then(res => {
          vm.list = res.data.data.data;
          console.log("nwe----------",vm.list)
        }).catch(error => {
          console.log(error)
        });
      },
      //预览已经上传的图片
      proviewImg(row){
        console.log(row)
        console.log(11)
        // 带参跳转
        this.$router.push({ path: '/example/preProImgs', query: { idAttr: row.idAttr } });

      },
      //去上传照片
      undoneImage(index,row){
        this.detailProDialog=true;
        console.log(index)
        console.log(row)
        this.idAttr=row.idAttr;
      },
      // 编辑
      handleEdit(index, row) {
        const vm = this;
        console.log('编辑的row：', index, '-----', row);
        console.log(this.list[index]);

        let pro=this.list[index];
        this.product.idAttr=pro.idAttr;
        this.product.classid=pro.classid;
        this.product.colour=pro.colour;
        this.product.ftitle=pro.ftitle;
        this.product.outputsizemax=pro.outputsizemax;
        this.product.title=pro.title;
        this.product.outputSpeedColor=pro.output_speed_color;
        this.product.outputSpeedMono=pro.output_speed_mono;

        this.dialogFormVisible=true;

        this.axios.get(api.updatePro,vm.product)
          .then((suc)=>{
            vm.getList();
          })
          .catch((error)=>{

          })
      },
      // 单个删除
      handleDelete(index, row) {
        const vm = this;
        console.log('单个删除选择的row：', index, '-----', row);
        let newId={newId:row.id}
        this.axios.get(api.delNews,{params:newId})
          .then((success)=>{
            vm.getList();
            console.log("删除su")
          })
          .catch((error)=>{
            console.log("删除fa")
            console.log("error")
          })
        // vm.list.splice(index, 1)
      },
      // 批量删除
      handleDelAll() {
        const vm = this;
        console.log('批量删除选择的row：', vm.multipleSelection)
      },
      // 搜索
      handleFilter() {
        this.getList();
      },
      // 操作分页
      handleSizeChange(val) {
        // console.log('--------一页多少条：', val)
        this.listQuery.pageSize = val;
        this.getList();
      },
      // 操作分页
      handleCurrentChange(val) {
        // console.log('--------当前页：', val)
        this.listQuery.currPage = val;
        this.getList();
      },
      // 新增
      handleCreate() {
        this.dialogFormVisible = true;
      },
      // 新增提交
      handleCreateSubmit() {
        const vm = this;
        console.log('新增入参：', vm.product)

        this.axios.post(api.addPro,vm.product).then(suc=>{
          console.log("addPro成功")
          vm.getList();
        }).catch(err=>{
          console.log("addPro失败")
        })
        this.dialogFormVisible = false;
      },

      addNews(flag) {
        //参考 https://blog.csdn.net/qq_42394457/article/details/96769170
        console.log(flag)
        this.dialogFormVisible = false;
        let formData = new FormData();
        console.log('文件对象', this.imgFile)
        //这是提交到后台的文件
        formData.append('imgFile', this.imgFile.raw);
        formData.append('fileType', 'news');
        formData.append('title', this.news.title);
        formData.append('subtitle', this.news.subtitle);
        formData.append('nurl', this.news.nurl);
        this.axios.post(api.uploadFileByType, formData)
          .then((suc) => {
            console.log('图片上传成功');
            console.log(suc.data)
            this.$message({
              message: '图片上传成功',
              type: 'success'
            });
            this.flag = false;
            //重置输入库的值
            this.getList();
          })
          .catch((error) => {
            this.$message.error('上传失败');
            console.log(error)
          })

      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleDownload() {
        const vm = this;
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel');
          const tHeader = ['字段1', '字段2', '字段3', '字段4', '字段5'];
          const filterVal = ['chnlId', 'hisChnlId', 'chnlName', 'state', 'isavailable'];
          const list = vm.list;
          const data = vm.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '导出的列表excel');
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    }


  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
