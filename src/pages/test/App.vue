<template>
  <div class="reveal">
    <div class="slides">
      <section>Horizontal Slide</section>
      <section>
        <section>Vertical Slide 1</section>
        <section>Vertical Slide 2</section>
      </section>
    </div>
  </div>
</template>

<script>
import Reveal from "reveal.js";
export default {
  name: "test",
  components: {},
  mounted() {
    const RevealInstance = new Reveal();
    RevealInstance.initialize();
  }
};
</script>
