<template>
  <div class="baseHeaderView">
      <ImageListView />
      <!-- <router-view name="image"/> -->
  </div>
</template>

<script>
// import '@/assets/css/utility.css';
// import {xmlToJson} from '@/assets/js/x2j.js';

// import axios from "axios";
// import drf from '@/api/drf';
import {mapGetters, mapActions} from 'vuex';
import Constant from "@/common/Constant.js";
import ImageListView from '@/components/ImageListView.vue'

export default {
  name: 'BaseUtilityView',

  components: { 
    ImageListView,
    
  },

  data: () => ({
    /***
     * patient info
     * */
    patientInfo: {},

    /***
     * width, height
     * */
    DPI: 96,
    // canvas width, height
    canvasWidth: 0,
    canvasHeight: 0,

    // pixel * pixel spacing / 25.4 * 96
    realityImageWidth: 0,
    realityImageHeight: 0,
    //=========================================
  }),

  mounted() {
    window.addEventListener('resize', this.handleResize);
  },

  computed: {
    ...mapGetters([
      'patientRecordList',
      'patientSeriesList',
    ]),
  },
  
  methods: {
    async handleResize() {
      this.movingTop = 0;
      this.movingLeft = 0;
    },

    ...mapActions([
      Constant.GET_PATIENTRECORDLIST,
      Constant.GET_PATIENTSERIESLIST,
    ]),
  }
}
</script>

<style>
.baseHeaderView {
  /* background-color: black; */
  width: 100%;
  /* height: calc(100% - 80px); */
  display: flex;
}
</style>