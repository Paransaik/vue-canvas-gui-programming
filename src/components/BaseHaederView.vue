<template>
  <div class="baseHeaderView">
    <UtilityView/>
    <BaseUtilityView/>
  </div>
</template>

<script>
import UtilityView from '@/components/UtilityView.vue';
import BaseUtilityView from '@/components/BaseUtilityView.vue'

export default {
  name: 'BaseHeaderView',

  components: {
    UtilityView,
    BaseUtilityView
  },
}
</script>

<style>
  .baseHeaderView {
    background-color: orange;
    width: auto;
    height: auto;
    display: flex;
  }
</style>
