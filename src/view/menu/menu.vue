<style lang="less">
  @import './menu.less';
</style>
<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Select v-model="searchKey" class="search-col">
          <Option v-for="item in columns" v-if="item.key !== 'handle'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
        </Select>
        <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
      </div>
      <div class="content">
        <tree-table :expand-type="false" :selectable="false" :columns="columns" :data="tableData" >
          <template slot="meta" slot-scope="scope">
            <span v-text="formateMeta(scope)"></span>
          </template>
          <template slot="operate" slot-scope="scope">
            <Button @click="edit(scope.row)" icon="md-create" type="primary" shape="circle" size="small"></Button>
          </template>
        </tree-table>
      </div>
    </Card>
    <Modal
      v-model="seeAble"
      title="编辑">
    </Modal>
  </div>
</template>
<script>
  import {getMenuList} from '@/api/menu'
  export default {
    name: 'tables_page',
    components: {

    },
    data () {
      return {
        columns:[
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
        tableData:[],
        searchKey: '',
        searchValue: '',
        seeAble: false
      }
    },
    methods: {
      handleSearch() {

      },
      formateMeta(scope) {
        let str= JSON.stringify(scope.row.meta)
        return str
      },
      edit(row) {
        this.seeAble = true

      }
    },
    mounted () {
      getMenuList().then(res=>{
        if (res.data.code === 1) {
          this.tableData= res.data.data
        } else if (res.data.code == -1 ) {
          this.$Message.error(res.data.msg)
        }
      })

    }
  }
</script>

<style>

</style>
