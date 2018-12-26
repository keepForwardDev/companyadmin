<style lang="less">
  @import './menu.less';
</style>
<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Select v-model="searchKey" class="search-col">
          <Option v-for="item in searchColumns" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}
          </Option>
        </Select>
        <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索
        </Button>
        <div class="operate">
          <Button @click="newMenu()" class="search-btn" type="success"><Icon type="ios-add-circle"/>&nbsp;&nbsp;新增
          </Button>
        </div>
      </div>
      <div class="content">
        <tree-table :expand-type="false" :selectable="false" :columns="columns" :data="tableData">
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
    </Card>
    <Modal
      v-model="seeAble"
      width="700px"
      ok-text="保存"
      :loading="loading"
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
              <span class="label-item">唯一标识</span>
            </template>
            <Input v-model="formItem.name" placeholder="作为菜单列表唯一区分"></Input>
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
              <Tree :data="tableData" ref="tree"></Tree>
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
            <Input v-model="formItem.meta" placeholder="json格式,默认填入菜单名称"></Input>
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
  </div>
</template>
<script>
import { getMenuList, saveMenu, deleteMenu } from '@/api/menu'
import { checNotNull } from '@/libs/validate'

export default {
  name: 'tables_page',
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
      searchKey: 'title',
      searchValue: '',
      seeAble: false,
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
      this.formItem = this.initFormItem()
      this.seeAble = true
    },
    treeChange (arr, obj, o) {

    },
    edit (row) {
      this.expanAll()
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
        var index = row.rowIndex
        var select = document.getElementsByClassName('ivu-tree-title')
        select[index].click()
        this.$refs['menuForm'].validate()
      }, 1000)
      this.seeAble = true
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
          var selectNode = this.getSelectNode()
          this.formItem.parentId = selectNode
          var data = Object.assign({}, this.formItem)
          data.meta = this.transJson()
          saveMenu(data).then(res => {
            if (res.data.code === 1) {
              this.$Message.success(res.data.msg)
              this.seeAble = false
            } else {
              this.$Message.error(res.data.msg)
            }
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
      deleteMenu(row.id).then(res => {
        this.$Message.success(res.data.msg)
      }).catch(err => {
        console.log(err)
        this.$Message.success('网络繁忙，请稍后再试')
      })
    },
    transJson () { // 将meta变成json
      var json
      if (this.formItem.meta) {
        try {
          json = JSON.parse(meta)
          if (json.title) {

          } else {
            json.title = this.formItem.title
          }
        } catch (e) {

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
    }
  },
  mounted () {
    getMenuList().then(res => {
      if (res.data.code === 1) {
        this.tableData = res.data.data
      } else if (res.data.code === -1) {
        this.$Message.error(res.data.msg)
      }
    })
  }
}
</script>

<style>

</style>
