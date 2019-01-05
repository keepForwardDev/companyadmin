<style lang="less" scoped>
  .operate {
    float: right;
  }

  .operate button {
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .label-item {
    font-weight: 700;
  }
  @import '~@/plugin/ztree/css/zTreeStyle/zTreeStyle.css';
</style>
<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <div class="operate" style="float: right;">
          <Button @click="newMenu()" class="search-btn" type="success" style=""><Icon type="ios-add-circle"/>&nbsp;&nbsp;新增
          </Button>
        </div>
      </div>
      <div class="content">
        <tree-table :expand-type="false" :selectable="true" :columns="columns" :data="tableData" :is-fold="false">
          <template slot="meta" slot-scope="scope">
            <span v-text="formateMeta(scope)"></span>
          </template>
          <template slot="operate" slot-scope="scope">
            <Button @click="edit(scope)" icon="md-create" type="primary" shape="circle" size="small"
                    title="编辑"></Button> &nbsp;&nbsp;
            <Button @click="deleteMenu(scope.row)" icon="ios-trash" type="error" shape="circle" size="small"
                    title="删除"></Button>
          </template>
        </tree-table>
      </div>
      <div class="backup">
        <template>
          <BackTop :height="100" :bottom="200">

          </BackTop>
        </template>
      </div>
    </Card>
    <Modal
      v-model="seeAble"
      width="700px"
      ok-text="保存"
      :loading="loading"
      :scrollable="true"
      @on-ok="saveForm"
      :title="title">
      <Form :model="formItem" :label-width="200" :rules="ruleValidate" ref="menuForm">
        <Row>
          <Col :span="span">
          <FormItem prop="title">
            <template slot="label">
              <span class="label-item">菜单名称</span>
            </template>
            <Input v-model="formItem.title" placeholder="请输入菜单名称"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem prop="path">
            <template slot="label">
              <span class="label-item">访问地址</span>
            </template>
            <Input v-model="formItem.path" placeholder="请输入访问地址"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem prop="name">
            <template slot="label">
              <span class="label-item">页面组件名称</span>
            </template>
            <Input v-model="formItem.name" placeholder="对应页面的 export name ，作为菜单唯一标识"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem prop="component">
            <template slot="label">
              <span class="label-item">组件地址</span>
            </template>
            <Input v-model="formItem.component" placeholder="例如：view/menu/menu.vue，填写错误将无法正确跳转"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem>
            <template slot="label">
              <span class="label-item">父级菜单</span>
            </template>
            <template>
              <!--<Tree :data="tableData" ref="tree"></Tree>-->
              <ul id="tree" class="ztree" style="width:230px; overflow:auto;"></ul>
            </template>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem>
            <template slot="label">
              <span class="label-item">路由meta</span>
            </template>
            <Input v-model="formItem.meta" placeholder="json格式,默认填入菜单名称，格式需正确，否则无法解析"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem>
            <template slot="label">
              <span class="label-item">排序号</span>
            </template>
            <InputNumber v-model="formItem.sort" placeholder="请输入排序号" size="large"></InputNumber>
            <span style="color: #dcdee2;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;菜单列表顺序</span>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal
      v-model="deleteAble"
      width="300px"
      :draggable="true"
      :loading="deleteLoading"
      @on-ok="confirmDelete" title="确认">
      是否确认删除？
    </Modal>
  </div>
</template>
<script>
import { getMenuList, saveMenu, deleteMenu, getTree } from '@/api/menu'
import { checNotNull } from '@/libs/validate'
import { sloveErr } from '@/libs/util'
import '@/plugin/ztree/js/jquery-1.4.4.min.js'
import '@/plugin/ztree/js/jquery.ztree.all.js'
export default {
  name: 'sys_menu',
  components: {},
  data () {
    return {
      columns: [
        {
          title: '名称',
          key: 'title',
          align: 'center',
          width: '200px'
        }, {
          title: '访问地址',
          key: 'path',
          width: '200px'
        }, {
          title: '唯一标识',
          key: 'name',
          align: 'center',
          width: '200px'
        }, {
          title: '路由meta',
          key: 'meta',
          width: '200px',
          type: 'template',
          template: 'meta'
        }, {
          title: '组件地址',
          key: 'component',
          width: '200px'
        }, {
          title: '排序号',
          key: 'sort',
          width: '200px'
        }, {
          title: '操作',
          key: 'operate',
          width: '200px',
          type: 'template',
          template: 'operate'
        }
      ],
      tableData: [],
      treeData: [],
      deleteId: '',
      searchKey: 'title',
      searchValue: '',
      seeAble: false,
      deleteAble: false,
      deleteLoading: false,
      loading: true,
      searchColumns: [
        {
          key: 'title',
          title: '菜单名称'
        }
      ],
      formItem: {
        title: '',
        path: '',
        name: '',
        meta: '',
        component: '',
        sort: 0,
        id: '',
        parentId: ''

      },
      span: 20,
      title: '新增',
      ruleValidate: {
        title: checNotNull(),
        path: checNotNull(),
        name: [{ required: true, message: '该项为必填项，请填写完整！', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            if (!isNaN(value)) {
              callback(new Error('请勿输入纯数字'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        component: checNotNull()
      },
      setting: {
        data:{
          simpleData:{
            enable:true,
            idKey: 'id',
            pidKey: 'parentId',
            rootId: 'null'
          }
        },
        callback: {
          beforeClick: function (treeId, treeNode, clickFlag) {
            var treeObj = $.fn.zTree.getZTreeObj("tree")
            var nodes = treeObj.getSelectedNodes()
            if (nodes.length > 0) {
              treeObj.cancelSelectedNode(nodes[0])
              if (nodes[0].id === treeNode.id) {
                return false
              }
            }
            return true
          }
        }
      }
    }
  },
  methods: {
    handleSearch () {

    },
    formateMeta (scope) {
      let str = JSON.stringify(scope.row.meta)
      return str
    },
    newMenu () {
      this.title = '新增'
      this.formItem = this.initFormItem()
      this.seeAble = true
    },
    treeChange (arr, obj, o) {

    },
    edit (row) {
      this.title = '编辑'
      this.formItem = {
        title: row.row.title,
        path: row.row.path,
        name: row.row.name,
        meta: JSON.stringify(row.row.meta),
        component: row.row.component,
        sort: row.row.sort,
        id: row.row.id,
        parentId: row.row.parentId
      }
      setTimeout(() => {
        this.$refs['menuForm'].validate()
        var treeObj = $.fn.zTree.getZTreeObj('tree')
        var node = treeObj.getNodeByParam('id', row.row.parentId, null)
        treeObj.selectNode(node)
      }, 500)
      this.seeAble = true
    },
    getParentIndex (index,currentIndex, node, j) {
      for (var i = 0; i< index; i++) {
        let len= node[i].children.length
        if (len + j >= currentIndex) {
          return j
        }
        if (len > 0) {
          j=this.getParentIndex(len, currentIndex, node[i].children, j)
        }
        j++
      }
      return j
    },
    expanAll () {
      for (var i in this.tableData) {
        this.tableData[i].expand = true
        if (this.tableData[i].children.length > 0) {
          this.expanChild(this.tableData[i].children)
        }
      }
    },
    expanChild (child) {
      for (var i in child) {
        child[i].expand = true
        if (child[i].children.length > 0) {
          this.expanChild(child[i].children)
        }
      }
    },
    initFormItem () {
      let formItem = {
        title: '',
        path: '',
        name: '',
        meta: '',
        component: '',
        sort: 0,
        id: '',
        parentId: ''
      }
      return formItem
    },
    saveForm () {
      this.loading = true
      this.$refs['menuForm'].validate((valid) => {
        if (valid) {
          //var selectNode = this.getSelectNode()
          var treeObj = $.fn.zTree.getZTreeObj('tree')
          var nodes = treeObj.getSelectedNodes()
          if (nodes.length>0) {
            this.formItem.parentId = nodes[0].id
          }
          var data = Object.assign({}, this.formItem)
          data.meta = this.transJson()
          saveMenu(data).then(res => {
            if (res.data.code === 1) {
              this.$Message.success(res.data.msg)
              this.seeAble = false
              this.getZtree()
              this.getMenu()
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            sloveErr(err, this)
          })
        } else {
          setTimeout(() => {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }, 1000)
        }
      })
    },
    deleteMenu (row) {
      this.deleteAble = true
      this.deleteId = row.id
    },
    confirmDelete() {
      var params= {
        id: this.deleteId
      }
      deleteMenu(params).then(res => {
        this.$Message.success(res.data.msg)
        this.getZtree()
        this.getMenu()
      }).catch(err => {
        sloveErr(err, this)
      })
    },
    transJson () { // 将meta变成json
      var json
      if (this.formItem.meta) {
        try {
          json = JSON.parse(this.formItem.meta)
          if (json.title) {

          } else {
            json.title = this.formItem.title
          }
        } catch (e) {
          json = {
            title: this.formItem.title
          }
        }
      } else {
        json = {
          title: this.formItem.title
        }
      }
      return json
    },
    getSelectNode () {
      var selectNode = this.$refs['tree'].getSelectedNodes()
      if (selectNode.length > 0) {
        return selectNode[0].id
      } else {
        return ''
      }
    },
    getMenu() {
      getMenuList().then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.data
        } else if (res.data.code === -1) {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        sloveErr(err, this)
      })
    },
    getZtree() {
      getTree().then(res => {
        if (res.data.code === 1) {
          $.fn.zTree.init($("#tree"), this.setting, res.data.data)
        } else if (res.data.code === -1) {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        sloveErr(err, this)
      })
    }
  },
  mounted () {
    this.getMenu()
    this.getZtree()
  }
}
</script>
