<template>
  <div class="homeContainer">
    <HaederView/>
    <BaseHaederView/>
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
    BaseHaederView
  },
}
</script>

<style>

.homeContainer {
  margin: 10px;
  border: solid black 1px;
  /* border: 1px dotted red; */
  height: 800px;
  display: flex;
  flex-direction: column;
}
</style>