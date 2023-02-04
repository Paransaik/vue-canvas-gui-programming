<template style="height: 100%">
  <div class="homeContainer">
    <HaederView/>
    <BaseHaederView/>
    <!-- cursor event -->
    <!-- <div id="cursor" :style="cursorPoint"></div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import HaederView from '@/components//HaederView.vue';
import BaseHaederView from '@/components/BaseHaederView.vue';

export default {
  name: 'HomeView',

  components: {
    HaederView,
    BaseHaederView,
  }
  /*data() {
    return {
      x: 0,
      y: 0,
    }
  },
  methods: {
    moveCursor(e) {
      this.x = e.clientX - 10;
      this.y = e.clientY - 10;
    }
  },
  computed: {
    cursorPoint() {
      return `transform: translate(${this.x}px,${this.y}px)`
    }
  },
  mounted() {
    document.addEventListener("mousemove", this.moveCursor);
  }*/
}
</script>

<style>
.homeContainer {
  border: solid black 1px;
  /* border: 1px dotted red; */
  height: 100%;
  flex-direction: column;
}
/* cursor event */
/*#cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: red;
  top: 0;
  left: 0;
  z-index: 10000;
}*/
</style>

