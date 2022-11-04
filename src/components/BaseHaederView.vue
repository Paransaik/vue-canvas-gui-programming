<template>
  <div class="baseHeaderView">
    <!-- datas: 받은 자식 datas -->
    <UtilityView @datas="sendDatas"/> 
    <!-- datas: 넘길 자식 datas(현재 data에 있는 값)-->
    <!-- propsdata: 자식에서 사용할 변수 이름 -->
    <BaseUtilityView :propsdata="datas"/>
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
    datas: {
      type: {'name': '', 'state': ''},
      inverse: 0,
      angle: [],
    },

  }),

  methods: {
    sendDatas(d) {
      this.datas.type = d.type;
      this.datas.inverse = d.inverse;
      this.datas.angle = d.angle;
      console.log(this.datas.type);
    }
  },
  
}
</script>

<style>
  .baseHeaderView {
    background-color: orange;
    width: auto;
    height: 100%;
    display: flex;
  }
</style>
