## 小度搜索
这个程序采用了Vue+element-ui的结构，同时混用了jQuery（其实不想用jQuery的，多low啊），使用jQuery来处理HTML代码转换，以及对HTML请求的ajax处理。
部署方式可以直接运行或者打包之后放到NGINX中，直接运行的话命令为
``` npm run serve ```
打包放到NGINX的步骤为
``` npm run build ```
然后将打包完成之后生成的dist目录里面所有内容放到NGINX下的html文件夹内，同时删除html文件夹内原有的文件。
下一步我们进入到NGINX的conf目录下，找到nginx.conf文件，将里面的内容替换为我们程序中的这个nginx.conf
```
worker_processes  1;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
		location /api/ {
			proxy_pass https://www.baidu.com/;
			proxy_set_header  X-Real-IP  $remote_addr;
			proxy_set_header Host www.baidu.com;
			proxy_set_header is_xhr 1;
		}
        error_page  404              /404.html;
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```
替换完成之后直接启动nginx即可。

---
---
##接下来我们一步步分析整个流程
###首先分析输入提示这个功能
这个程序的核心在于jsonp请求，以及从百度请求结果html，需要去分析该网页的请求模式。
![avatar](http://tc.pinea.club/img/step1.png)
比如我们首先分析这个输入文字自动提示选项的功能，可以看到这是一个jsonp请求，其次，在分析这个方法必要的参数。
![avatar](http://tc.pinea.club/img/step1_param.png)
通过一步步删减里面的参数，在分析返回值的变化得出，“wd”这个参数是请求的关键字，“cb”这个参数是jsonp的回调方法名，其余参数皆可以省去。有了这个结果之后，我们就可以实现同样的输入提示的功能了。

###下一步，我们需要分析百度后的结果
![avatar](http://tc.pinea.club/img/step2.png)
此时我们发现了一个返回了页面的一个ajax请求（分析请求headers里面request headers内有“X-Requested-With: XMLHttpRequest”这个请求头的即是ajax请求）
同上一步骤一样，分析param里面有哪些是必须的参数，最终分析得出，“wd”为百度一下请求的关键字，此时我们如果直接在程序中请求该接口我们会发现会出错，这个问题便是典型的跨域问题。
![avatar](http://tc.pinea.club/img/step2_proxy.png)
解决方法便是配置代理，这里我给出的代理方法有两种，一种是直接在前端服务器中配置代理跨域，第二种是在nginx中配置代理，两种方式都可以实现跨域请求。第一种方式配置在根目录下的“vue.config.js”文件中，第二种方式就是nginx.conf文件中的“location /api/ {}”这部分代码
解决了跨域问题之后，我们就需要使用jQuery来处理返回的HTML代码了，毕竟这个接口返回的不是json数据，需要我们手动处理，这里我的处理方法也非常简单粗暴，直接只取每个结果的标题，其余部分都不要。
```
let left_content = $(data).find(
"#container #content_left h3.t"//jQuery查找元素的方法
);
document.getElementById("content").innerHTML = "";
for (let i = 0,l = left_content.length;i < l;i++) {
    document.getElementById("content").appendChild(left_content[i]);
}
```

## 再接下来就是翻页了

跟第二步步骤相似，通过一步步排除分析代码中控制翻页的参数，这里稍微有点复杂，参数较多，但是慢慢分析还是可以分析的出，“pn”这个参数即是翻页的参数，或者说是结果集的初始index，从该位置开始取，默认取10条，所以我们穿传参数时，第二页传10即可，第三页传20，第一页不传即可。以此类推，我们便得出了翻页的处理方式。

---
---
##小结
这种类似的分析方式可以适用于很多网站，爬虫等方式，熟悉该方式分析页面请求之后，对于解决网站请求类的bug，爬虫抓取等都有很大的提升。
最后，希望这篇文章能帮到你。谢谢阅读。
