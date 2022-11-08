<template>
  <div class="baseHeaderView">
    <!-- datas: 받은 자식 datas -->
    <UtilityView
        @datas="sendDatas"
        @selectedColor="sendColor"
        @selectedLine="sendLine"
        @selectedAngle="sendAngle"
    />
    <!-- datas: 넘길 자식 datas(현재 data에 있는 값)-->
    <!-- propsdata: 자식에서 사용할 변수 이름 -->
    <BaseUtilityView
        :propsdata="datas"
        :propsColor="selectedColor"
        :propsLine="selectedLine"
        :propsAngle="selectedAngle"
    />
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

    // 3
    selectedColor: '#FF0000',
    selectedLine: 1,

    // 4
    selectedAngle: {
      type: {'name': '', 'state': ''},
      angle: [],
    }
  }),

  methods: {
    sendDatas(d) {
      this.datas.type = d.type;
      this.datas.inverse = d.inverse;
      this.datas.angle = d.angle;
      console.log(this.datas);
    },

    // 2
    sendColor(c) {
      this.selectedColor = c;
    },

    // 2
    sendLine(l) {
      console.log(typeof(l))
      this.selectedLine = l;
    },

    // 4
    sendAngle(a) {
      this.selectedAngle = a;
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
