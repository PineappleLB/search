import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import jsonp from 'jsonp';
import jquery from 'expose-loader?$!jquery';

//处理时间格式化代码
// Date.prototype.format = function(fmt) { //author: meizz
// 	let o = {
// 		"M+": this.getMonth() + 1, //月份
// 		"d+": this.getDate(), //日
// 		"h+": this.getHours(), //小时
// 		"m+": this.getMinutes(), //分
// 		"s+": this.getSeconds(), //秒
// 		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
// 		"S": this.getMilliseconds() //毫秒
// 	};
// 	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
// 	for(let k in o)
// 		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
// 	return fmt;
// };
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$ = jquery;
Vue.prototype.$jsonp = jsonp;
new Vue({
  render: h => h(App),
}).$mount('#app')
