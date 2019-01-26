<template>
  <div id="app">
    <div>
      <el-autocomplete
        class="inline-input"
        v-model="keyWords"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        @select="handleSelect"
      ></el-autocomplete>
    </div>
    <div id="content"></div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      keyWords: ""
    };
  },
  methods: {
    handleSelect(item) {
      this.$.ajax({
        type: "get",
        async: true,
        url: "/api/s?&wd=" + encodeURI(item.value),
        dataType: "html",
        success: function(data) {
          let left_content = $(data).find("#container #content_left .result h3");
          document.getElementById("content").innerHTML = "";
          for(let i in left_content){
            document.getElementById("content").appendChild(left_content[i]);
          }
          // left_content[0].innerHTML;
          var str = JSON.stringify(data);
        },
        error: function(e) {
          console.error(e)
        }
      });
    },
    querySearch(queryString, cb) {
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
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.el-input__inner {
  text-align: center;
}
.el-autocomplete-suggestion li {
  text-align: center;
}
#content .t em{
  color: red;
}
</style>
