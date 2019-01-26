<template>
  <div id="app">
    <div id="head">
      <h1>小度搜索</h1>
    </div>
    <div id="search">
      <el-row>
        <el-col :span="24">
          <el-autocomplete
            class="inline-input"
            v-model="keyWords"
            @change="changeKeyWords(this)"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
          </el-autocomplete>
        </el-col>
      </el-row>
    </div>
    <div id="content"></div>
    <div id="pagination" v-if="hasData">
      <el-row>
        <el-col :span="12">
          <div class="page-button">
            <el-button type="primary" @click="changePage(-1)">上一页</el-button>
            <el-button type="primary" @click="changePage(1)">下一页</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="page" @keyup.enter="changePage(0)">
            <el-input type="number" v-model="pageIndex" placeholder="请输入页数" class="input-with-select">
              <template slot="prepend">跳转到</template>
              <template slot="append">页</template>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      keyWords: "",
      hasData: false,
      pageIndex: 1,
    };
  },
  methods: {
    changePage(incr){
      if(!this.keyWords){
        document.getElementById("content").innerHTML = "";
        this.hasData = false;
        return;
      }
      this.search(this.keyWords, this.pageIndex + incr);
    },
    handleSearch(){
      this.search(this.keyWords);
    },
    search(val, page=1){
      let that = this;
      this.$.ajax({
        type: "get",
        async: true,
        url: `/api/s?pn=${(page - 1) * 10}&wd=${encodeURI(val)}`,
        dataType: "html",
        success: function(data) {
          let left_content = $(data).find(
            "#container #content_left h3.t"
          );
          document.getElementById("content").innerHTML = "";
          for (let i = 0,l = left_content.length;i < l;i++) {
            document.getElementById("content").appendChild(left_content[i]);
          }
          // left_content[0].innerHTML;
          that.hasData = left_content.length > 0;
        },
        error: function(e) {
          console.error(e);
        }
      });
    },
    handleSelect(item) {
      this.search(item.value)
    },
    querySearch(queryString, cb) {
      this.keyWords = queryString;
      this.$jsonp(
        `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/?wd=${queryString}`,
        { param: "cb" },
        (err, data) => {
          if (err) {
            cb([]);
            return;
          }
          let values = data.s.map(o => {
            return {
              value: o
            };
          });
          cb(values);
        }
      );
      cb([]);
    }
  }
};
</script>

<style>
#app {
  font-family: "楷体", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 800px;
  margin: 0 auto;
  margin-top: 40px;
}
.el-input__inner {
  text-align: center;
}
.el-autocomplete{
  width: 100%;
}
.el-autocomplete-suggestion li {
  text-align: center;
}
#search {
  width: 600px;
  margin: 0 auto;
}
#content{
  width: 600px;
  margin: 0 100px;
}
#content h3{
  text-align: left;
  font-weight: 400;
  font-size: 22px;
  letter-spacing: 0.01em;
  width: 600px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid lightgray;
}
#content .t em {
  color: red;
}
#content .t a{
  text-decoration: none;
}
#content .t em::before{
  content: " ";
}
#content .t em::after{
  content: " ";
}
#content {
  width: 800px;
}
#pagination{
  width: 600px;
  margin: 0 auto;
}
#pagination .page-button{
  text-align: left;
}
#pagination .page-button .el-button+.el-button{
  margin-left: 60px;
}
#pagination .page{
  text-align: left;

}
</style>
