<template>
    <div class="app-container">
        <!--        <h2 style="color:red">-->
        <!--           产品管理页面-->
        <!--        </h2>-->

        <!-- 搜索条件 -->
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="人员收索"
                      v-model="listQuery.name">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" @click="handleCreate" icon="edit">添加后管人员</el-button>
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
            <el-table-column label="账号" align="center" width="100px" prop="rating.average">
                <template slot-scope="scope">
                    {{scope.row.account}}
                </template>
            </el-table-column>
            <el-table-column label="头像" align="center" width="100px" prop="rating.average">
                <template slot-scope="scope">
                    <!--<el-image :src="scope.row.titleUrl"/>-->
                    <el-image :src="scope.row.titleUrl"></el-image>
                </template>
            </el-table-column>

            <el-table-column label="昵称" width="" align="center">
                <template slot-scope="scope">
                    {{scope.row.nickName}}
                </template>
            </el-table-column>
            <el-table-column label="真实姓名" width="" prop="title">
                <template slot-scope="scope">
                    {{scope.row.realName}}
                </template>
            </el-table-column>
            <el-table-column label="性别" width="" prop="subtitle">
                <template slot-scope="scope">
                    <span v-if="scope.row.sex==1">男</span>
                    <span v-else>女</span>
                </template>
            </el-table-column>
            <el-table-column label="邮件地址" width="" prop="title">
                <template slot-scope="scope">
                    {{ scope.row.emailAddress}}
                </template>
            </el-table-column>
            <el-table-column label="个人简介" width="" prop="title">
                <template slot-scope="scope">
                    {{ scope.row.introduce}}
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
            <el-form class="small-space" :model="user" label-position="left" label-width="70px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item label="账号">
                    <el-input v-model="user.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="user.password"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="user.nickName"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model="user.realName"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="user.sex" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.sex"
                                :label="item.label"
                                :value="item.sex">
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="user.sex"></el-input>-->
                </el-form-item>
                <el-form-item label="邮件地址">
                    <el-input v-model="user.emailAddress"></el-input>
                </el-form-item>
                <el-form-item label="个人简介">
                    <el-input v-model="user.introduce"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload
                            class="upload-demo"
                            drag
                            :auto-upload="false"
                            :on-change="checkType"
                            action="none"
                            :file-list="fileList"
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
        user: {
          id: '',
          account: '',
          emailAddress: '',
          introduce: '',
          nickName: '',
          password: '',
          realName: '',
          sex: ''
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
        detailProDialog: false,
        multipleSelection: [],
        newData: {},
        file: [],
        flag: true,
        idAttr: '',//产品id
        imgFile: null,
        fileList: [],
        options: [{
          sex: '1',
          label: '男'
        }, {
          sex: '0',
          label: '女'
        }]


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
        this.fileList.push(file)
      },
      //多文件上传
      httpRequest(param) {
        this.file.push(param.file);// 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      },
      // 多文件上传
      uploadFiles() {
        var that = this;
        var upData = new FormData();
        this.$refs.upload.submit();// 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
        this.file.forEach(function(file) {// 因为要上传多个文件，所以需要遍历
          upData.append('files', file, file.name);
          // upData.append('file', this.file); //不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
        })
        this.newData.idAttr = that.idAttr;
        upData.append('proDes', JSON.stringify(this.newData)) // 这里需要转换一下格式传给后台

        this.axios.post(api.uploadFiles, upData)
          .then(function(succ) {
            console.log(succ.data)
            if (succ.data.code == 200) {
              console.log('上传成功')
              that.file = [];
              that.removeImgs();
              that.detailProDialog = false;
              that.getList();
              that.idAttr = '';
              that.newData.proName = ''
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      cancelDialog() {
        this.file = [];
        this.removeImgs();
        this.detailProDialog = false;
        this.idAttr = '';
        this.newData.proName = ''
      },
      removeImgs() {
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
          userName: vm.listQuery.name         // 新闻标题
          // tag: vm.listQuery.type       // 类型
        };
        //获取产品列表
        this.axios.get(api.getUsers, { params: par }).then(res => {
          vm.list = res.data.data.data;
          console.log('nwe----------', vm.list)
        }).catch(error => {
          console.log(error)
        });
      },
      //预览已经上传的图片
      proviewImg(row) {
        console.log(row)
        console.log(11)
        // 带参跳转
        this.$router.push({ path: '/example/preProImgs', query: { idAttr: row.idAttr } });

      },
      //去上传照片
      undoneImage(index, row) {
        this.detailProDialog = true;
        console.log(index)
        console.log(row)
        this.idAttr = row.idAttr;
      },
      // 编辑
      handleEdit(index, row) {

      },
      // 单个删除
      handleDelete(index, row) {
        const vm = this;
        console.log('单个删除选择的row：', index, '-----', row);
        let userId = { userId: row.id }
        this.axios.get(api.delUser, { params: userId })
          .then((success) => {
            vm.getList();
            console.log('删除su')
          })
          .catch((error) => {
            console.log('删除fa')
            console.log('error')
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

        this.axios.post(api.addPro, vm.product).then(suc => {
          console.log('addPro成功')
          vm.getList();
        }).catch(err => {
          console.log('addPro失败')
        })
        this.dialogFormVisible = false;
      },

      addNews(flag) {
        var that = this;
        this.dialogFormVisible = false;
        let formData = new FormData();
        console.log('文件对象', this.imgFile)
        //这是提交到后台的文件
        formData.append('imgFile', this.imgFile.raw);
        formData.append('fileType', 'user');
        formData.append('account', this.user.account);
        formData.append('emailAddress', this.user.emailAddress);
        formData.append('introduce', this.user.introduce);
        formData.append('nickName', this.user.nickName);
        formData.append('password', this.user.password);
        formData.append('realName', this.user.realName);
        formData.append('sex', this.user.sex);
        this.axios.post(api.uploadFileByType, formData)
          .then((suc) => {
            console.log('图片上传成功');
            console.log(suc.data)
            this.$message({
              message: '图片上传成功',
              type: 'success'
            });
            this.flag = false;
            that.imgFile = null;
            that.fileList = [];
            that.user.account = '';
            that.user.emailAddress = '';
            that.user.introduce = '';
            that.user.nickName = '';
            that.user.password = '';
            that.user.realName = '';
            that.user.sex = '';
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
