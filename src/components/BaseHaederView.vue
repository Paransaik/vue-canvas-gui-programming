<template>
  <div class="baseHeaderView">
    <UtilityView @status="test"/>
    <BaseUtilityView :status="deliveryStatus"/>
    {{ num }}
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

  data: () => ({
    deliveryStatus: false,
  }),

  methods: {
    test(e) {
      this.deliveryStatus = e;
    }
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
