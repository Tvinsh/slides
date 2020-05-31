<template>
  <div class="reveal container">
    <div class="slides">
      <section>SharedWorker 简介</section>
      <section>
        <section>
          SharedWorker 可以实现同域下，几个窗口、iframe 或其他 worker 共用同一个
          worker 线程
          <div style="margin-top: 10px;">
            <a href="http://mdn.github.io/simple-shared-worker/" target="_blank"
              >示例一</a
            >&nbsp;&nbsp;&nbsp;&nbsp;
            <a
              href="https://ayushgp.github.io/scaling-websockets-using-sharedworkers/"
              target="_blank"
              >示例二</a
            >
          </div>
        </section>
        <section>
          <p class="container-16">
            有个问题:
          </p>
          <p class="container-16">
            创建的时候需要指定 shared-worker 脚本的 url
          </p>
          <p class="container-16">
            本地的 worker 脚本文件经过 webpack 打包后会加上 hash
          </p>
          <p class="container-16">
            导致我们创建的时候无法指定打包后的脚本 url
          </p>
          <img src="../../assets/shared-worker.png" />
        </section>
        <section>
          <p class="container-16">
            解决方案:
          </p>
          <p class="container-16">
            通过 plugin + loader
          </p>
        </section>
        <section>
          <p class="container-16">
            一个 webpack plugin 由以下几个步骤组成：
          </p>
          <p class="container-16">
            • 一个JavaScript类函数
          </p>
          <p class="container-16">
            • 在函数原型 (prototype)中定义一个注入compiler对象的apply方法
          </p>
          <p class="container-16">
            •
            apply函数中通过compiler插入指定的事件钩子,在钩子回调中拿到compilation对象
          </p>
          <p class="container-16">
            • 使用compilation操纵修改webapack内部实例数据
          </p>
          <p class="container-16">
            • 异步插件，数据处理完后使用callback回调
          </p>
        </section>
        <section>
          <p class="container-16">
            一个 loader 运行的大致流程：
          </p>
          <p class="container-16">
            • 初始阶段将用户配置与默认配置合并
          </p>
          <p class="container-16">
            • 在 webpack 通过 NormalModuleFactory 创建 NormalModule
            实例前解析相关路径等
          </p>
          <p class="container-16">
            • 将loader处理完的模块内容输出，进入后续的编译流程
          </p>
        </section>
        <section>
          <img src="../../assets/loader.png" />
        </section>
        <section>
          <p class="container-16">
            在NormalModuleFactory中，创建出NormalModule实例之前会涉及到四个钩子：
          </p>
          <p class="container-16">
            • beforeResolve <br />
            • resolve <br />
            • factory <br />
            • afterResolve
          </p>
          <p class="container-16">
            其中较为重要的有两个：<br />
            resolve部分负责解析loader模块的路径（例如css-loader这个loader的模块路径是什么）<br />
            factory负责来基于resolve钩子的返回值来创建NormalModule实例
          </p>
        </section>
      </section>
      <section>
        <pre><code data-trim data-noescape>
            // 业务页面
            if (window.SharedWorker) {
              const worker = new SharedWorker('./worker', { type: 'module' });
              worker.port.onmessage = ({ data }) => {
                ...
              };
              worker.port.postMessage('start');
            }
            
            // worker.js
            // 共用逻辑可以写在 onconnect 外面
            onconnect = (e) => {
              const port = e.ports[0];
              ...
              port.postMessage(...);
              port.onmessage = ({ data }) => {
                ...
              };
            }
            
            // 插件使用
            plugins: [
              new WorkerPlugin({
                globalObject: 'self'
              })
            ]
          </code></pre>
      </section>
      <section>
        <p class="container-16">
          在worker脚本中，可以通过 onconnect
          事件获取页面访问worker的端口port，可以通过port向页面发送消息和监听来自页面的消息。
          <br />
          <span class="container-red"
            >在worker脚本中，onconnect函数体外面的内容，在同域中只会执行一次，新开tab也不会再次执行</span
          >
          <br />
          <span class="container-red"
            >onconnect函数体内的内容，每开一个tab，都会执行一次，并且会生成与浏览器tab一一对应的port端口，worker与各个页面的通信，只能通过对应的port端口。</span
          >
          <br />
          在worker脚本中是不能访问window对象的，worker有自己的全局对象self。
        </p>
      </section>
      <section>
        <p class="container-p">调试：</p>
        <img src="../../assets/inspect.png" />
      </section>
      <section>
        <p class="container-16">
          打开
          <span class="container-red">chrome://inspect</span> 页面，选中shared
          workers tab，就可以看到当前注册过的shared
          workers脚本，其中terminate是手动关闭worker脚本，inspect可以唤起调试窗口，和devtools一样，可以在其中进行worker脚本的调试
        </p>
      </section>
      <section>
        <p class="container-p">关闭：</p>
        <p class="container-16">
          当同域下所有的tab页面都关闭了，当前域下注册的worker也会自动销毁，如果需要手动控制，可以在worker脚本中调用
          self.close() 来注销当前 worker
        </p>
      </section>
      <section>
        <p class="container-p">BroadcastChannel</p>
        <p class="container-16">
          worker 可以配合 BroadcastChannel 一起使用，BroadcastChannel
          允许同源脚本跨 window / tab、iframe、web worker 进行多对多通信 <br />
          BroadcastChannel 构造函数只接受参数，就是广播名称（channel name）
        </p>
      </section>
      <section>
        <pre><code data-trim data-noescape>
            const channel = new BroadcastChannel('message_xxx');
            // 发消息
            channel.postMessage({...});
            
            // 接收消息
            let channel = null;
            created () {
              channel = new BroadcastChannel('message_xxx');
              channel.addEventListener('message', this.handleMessageChannel);
            },
            beforeDestroy () {
              channel.removeEventListener('message', this.handleMessageChannel);
            },
            methods: {
              handleMessageChannel (event) {
                // 消息内容可以通过 event.data 获取
              }
            }
          </code></pre>
      </section>
      <section>Thanks</section>
    </div>
  </div>
</template>

<script>
import Reveal from "reveal.js";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
export default {
  name: "SharedWorker",
  components: {},
  mounted() {
    const RevealInstance = new Reveal({
      plugins: [RevealMarkdown, RevealHighlight]
    });
    RevealInstance.initialize();
  }
};
</script>

<style lang="less" scoped>
.container {
  &-p {
    font-size: 24px;
  }
  &-16 {
    font-size: 20px;
    line-height: 40px;
    text-align: left;
  }
  &-red {
    color: red;
  }
}
</style>
