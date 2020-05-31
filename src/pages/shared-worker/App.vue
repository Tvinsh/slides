<template>
  <div class="reveal">
    <div class="slides">
      <section>SharedWorker 简介</section>
      <section>
        <section>
          SharedWorker 可以实现同域下，几个窗口、iframe 或其他 worker 共用同一个
          worker 线程
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
      </section>
    </div>
  </div>
</template>

<script>
import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
export default {
  name: "SharedWorker",
  components: {},
  mounted() {
    const RevealInstance = new Reveal({
      plugins: [Markdown, RevealHighlight]
    });
    RevealInstance.initialize();
  }
};
</script>
