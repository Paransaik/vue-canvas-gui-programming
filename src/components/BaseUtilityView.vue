<template>
  <div class="baseUtilityView">

    <div class="mainPrintView" id="canvas">
      <VueDrawingCanvas
        ref="VueCanvasDrawing"
        v-model:image="image"
        :height="fullHeight"
        :width="fullWidth"
        :stroke-type="strokeType"
        :fill-shape="fillShape"
        :lineWidth="line"
        :color="color"
        :backgroundImage="backgroundImage"
        backgroundColor="black"
        @mousemove="getCoordinate($event)"
        saveAs="png"
        
        line-cap="round"
        line-join="round"
        :initial-image="initialImage"
        classes="utilityEvent"
        
        :styles="{
          // border: 'solid 1px #FF0000',
          objectFit: 'fill',
        }"
      />
    </div>
    <div class="thumbnail" :class="{thumbList:btnchg}">
      <div class="filterBtns" :class="{filterCng:btnchg}">
        <div>
          <span class="filterName">Date
            x-axis: <strong>{{ x }}</strong
            >, y-axis: <strong>{{ y }}</strong>
          </span>
          <select class="filterSelect">
            <option>All</option>
          </select>
        </div>
        {{propsdata}}
        <div>
          <span class="filterName">Modality</span>
          <select class="filterSelect">
            <option>All</option>
          </select>
        </div>
      </div>
      <div class="thumbnailList" :class="{ListCng:btnchg}">
    
        <div class="thumbnailBtn" @click="btnchg = !btnchg"> {{ btnchg ? "▲" : "▼" }} Thumbnail
        </div>
        <div id="thumbnails" 
        class="thumbnails" 
        :class="{thumbnailsCng:btnchg}" 
        @click="mainImg = iii, getImg('1.2.410.200062.2.1.20221013133913452.5.402158.541.502')">
          <!-- <div class="imgBox"
            @click="[mainImg = blobImgList, isActive=!isActive]"
            :class="{isToggle:isActive}"
            v-for="bIL in blobImgList"
            :key="bIL"
            > -->

            <!-- <div id="imgBox" class="imgBox"
            @click="[mainImg = getImg(p), isActive=!isActive]"
            :class="{isToggle:isActive}"
            v-for="p in patientSeriesList"
            :key="p"
            > -->

            <!-- {{bIL}} -->
            <!-- {{ getBlobIames[0] }} -->
            <!-- {{ blobImgList }} -->
            <!-- {{getBlobImgList}} -->
            <!-- <img class="img" :src="getImg(p)" style="pointer-events: none;"/> -->
            <!-- {{ getImg() }} -->
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import drf from '@/api/drf'
import { mapGetters, mapActions } from 'vuex';
import Constant from "@/common/Constant.js";
import VueDrawingCanvas from "vue-drawing-canvas";

export default {
  name: 'BaseUtilityView',

  components: {
    VueDrawingCanvas,
  },

  props: [
    'propsdata',
  ],

  data: () => ({
    fullHeight: 0,
    fullWidth: 0,
    fixedHeight: 0,
    fixedWidth: 0,

    mainImg: ' ',
    isActive: false,
    iii: '',
    btnchg : false,

    // canvas
    initialImage: [
      {
        type: "dash",
        from: {
          x: 262,
          y: 154,
        },
        coordinates: [],
        color: "#000000",
        width: 5,
        fill: false,
      },
    ],
    x: 0,
    y: 0,
    image: "",
    strokeType: "dash",
    fillShape: false,
    line: 5,
    // color: "#000000",
    color: "#FF0000",
    backgroundImage: null,
  }),

  mounted() {
    // this.fullHeight = document.getElementById('canvas').clientWidth;
    this.fullHeight = document.getElementById('canvas').clientHeight;
    this.fullWidth = document.getElementById('canvas').clientWidth;
    this.fixedHeight = this.fullHeight;
    this.fixedWidth = this.fullWidth;

    if ("vue-drawing-canvas" in window.localStorage) {
      this.initialImage = JSON.parse(
        window.localStorage.getItem("vue-drawing-canvas")
      );
    }
  },

  computed: {
    ...mapGetters([
      'patientSeriesList',
      'blobImgList',
    ]),
  },

  watch: {
    // propsdata: {
    //   deep: true,
    //   handler() {
    //     if (this.propsdata.angle[0] == 90 || this.propsdata.angle[0] == 270) {
    //       this.fullHeight = this.fixedWidth;
    //       this.fullWidth = this.fixedHeight;
    //     } else {
    //       console.log('180 or 360');
    //       this.fullHeight = this.fixedHeight;
    //       this.fullWidth = this.fixedWidth;
    //     }
    //     this.$refs.VueCanvasDrawing.redraw();
    //   }
    // },
  },
  
  created() {
  },

  methods: {
    ...mapActions([
      Constant.GET_PATIENTSERIESLIST,
      Constant.GET_BLOBIMGS,
    ]),

    async setImage(event) {
      let URL = window.URL;
      this.backgroundImage = URL.createObjectURL(event.target.files[0]);
      await this.$refs.VueCanvasDrawing.redraw();
    },

    getCoordinate(event) {
      let coordinates = this.$refs.VueCanvasDrawing.getCoordinates(event);
      this.x = coordinates.x;
      this.y = coordinates.y;
    },

    getImg(p) {
      const imgBox = document.getElementById('thumbnails');
      return axios({
          url: drf.patient.patientImgFileDownload(p),
          method: 'get',
          responseType: 'blob',
        }).then(async res => {
          const blob = URL.createObjectURL(new Blob([res.data], {type:'image/bmp'}));
          console.log(blob);
          const div = document.createElement('div');
          div.style.width = '160px';
          div.style.height = '90px';
          div.style.margin = '0 0 0 8px';
          div.style.border = 'solid 1px #d5dae5';
          div.style.backgroundColor = '#eaecf2';

          const img = document.createElement('img');
          img.setAttribute('src', blob);
          img.style.display = 'block';
          img.style.width = '90px';
          img.style.height = '89px';
          img.style.margin = '0 auto';

          div.appendChild(img);
          imgBox.appendChild(div);
          this.iii = blob;
          this.backgroundImage = blob;

          // this.fullWidth = this.fullHeight;
          // var cvs = document.getElementById("canvas").childNodes[0];
          // var ctx = cvs.getContext("2d");
          
          // const imggg = new Image();
          // imggg.src = blob;
          // // ctx.drawImage(imggg, (cvs.width -  cvs.height) / 2, 0, cvs.height, cvs.height);

          // imggg.onload = () => {
          //   ctx.drawImage(imggg, (cvs.width -  cvs.height) / 2, 0, cvs.height, cvs.height);
          // }
          
          await this.$refs.VueCanvasDrawing.redraw();
          // document.getElementById('imgBox').innerHTML = "<img class='img' src=" + blob +" style='pointer-events: none;'/>"
          return blob;

          
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // getImages(instanceID) {
    //   console.log(instanceID);
    //   return new Promise(function(resolve, reject){
    //     axios({
    //       url: drf.patient.patientImgFileDownload(instanceID),
    //       method: 'get',
    //       // headers: {
    //       //   "Content-Type": "multipart/form-data"
    //       // }
    //       responseType: 'blob',
    //       timeout: 5000,
    //     }).then(res => {
    //       const blob = URL.createObjectURL(new Blob([res.data], {type:'image/bmp'}));
    //       console.log(blob);
    //       resolve(blob)
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    //   });
    // },

    // const res = async () => {
    //   const bty = await axios.get(drf.patient.patientImgFileDownload(instanceID), {responseType: 'blob'});
    //   const blob = URL.createObjectURL(new Blob([bty.data], {type:'image/bmp'}));
    //   return blob;
    // };

    // res(1).then(d => {return d});

  },
}
</script>

<style scoped>
  .baseUtilityView {
    background-color: yellow;
    height: 718px;
    width: 100%;
    display: flex;
    overflow: auto;
    flex-direction: column;
    justify-content: flex-start;
  }

  .mainPrintView {
    /* object-fit: contain; */
    /* object-fit: cover; */
    /* object-fit: scale-down; */
    /* object-fit: fill; */

    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }

  .thumbnail {
    display: flex;
    flex-direction: row;
    height: 140px;
    width: auto;
  }

  .filterBtns{ 
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 148px;
    height: 140px;
    padding: 12px 16px 16px 16px;
    background-color: #d8dde8;
  }

  .filterName {
    margin: 0 0 4px 2px;
    font-family: MalgunGothic;
    font-size: 13px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #545454;
  }

  .filterSelect {
    width: 115px;
    height: 25px;
    border-radius: 2px;
    border: solid 1px #95a1b3;
    background-color: #fff;
  }

  .thumbnailList{
    width: 100%;
    height: auto;
    background-color: #f4f6f9;
    display: flex;
    flex-direction: column;
  }

  .thumbnailBtn{
    width: auto;
    height: 16px;
    font-family: MalgunGothic;
    font-size: 11px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.46px;
    text-align: center;
    cursor: pointer;
    color: #96a2b3;
  }
  
  .thumbnails{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    height: 124px;
    /* padding: 9px 0 6px 10px; */
    background-color: #f4f6f9;
  }

  /* HS */
  .mainCng{
    height: 100%;
  }

  .thumbList{
    height: 16px;
  }

  .ListCng{
    height: auto;
  }

  .filterCng{
    display: none;
  }
  
  .thumbnailsCng{
    display: none;
  }
  /* end */
  
  .imgBox {
    display: flex;
    flex-direction: col;
    width: 160px;
    margin: 0 0 0 8px;
    border: solid 1px #d5dae5;
    background-color: #eaecf2;
  }

  .img {
    margin: 0 auto;
    width: 90px;
    height: 89px;
  }

  .isToggle {
    border: solid 2px blue;
  }

  .utilityEvent {
    /* 1-1 */
    /* filter: translate(calc(1% * v-bind('propsdata.inverse') / 6)); */

    /* 1-2 */
    /* filter: scale(calc(1% * v-bind('propsdata.inverse') / 6)); */

    /* 2-1 */
    /* filter: brightness(calc(1% * v-bind('propsdata.inverse') / 6)); */

    /* 2-2 */
    filter: invert(calc(1% * v-bind('propsdata.inverse')));

    /* 4-1, 4-2, 4-3, 4-4*/
    transform: rotate(calc(1deg * v-bind('propsdata.angle[0]'))) 
                rotateX(calc(1deg * v-bind('propsdata.angle[1]'))) 
                rotateY(calc(1deg * v-bind('propsdata.angle[2]')));
  }

</style>
