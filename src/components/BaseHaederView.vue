<template>
  <div class="baseHeaderView">
    <div class="utilityView">
      <!-- 1 -->
      <div class="itemBox">
        <div
            class="item"
            v-for="(v, k) in first" :key="k"
            @click="first[k] = !v"
            :class="{isToggle:v}"
        >
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
      </div>
      <div class="line"></div>

      <!-- 2 -->
      <div class="itemBox">
        <div
            class="item"
            v-for="(v, k) in second" :key="k"
            @click="second[k] = !v, changedStrokeType(k), changedEvent(k)"
            :class="{isToggle:v}">
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
          <!-- ({'name' : k, 'state' : v }, inverse)-->
        </div>
      </div>
      <div class="line"></div>

      <!-- 3 -->
      <div class="itemBox">
        <div
            class="item bar"
            v-for="(v, k) in third" :key="k"
            @click="third[k] = !v, changedStrokeType(k)"
            :class="{isToggle:!v}"
        >
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
        <div><input type="color" class="item" v-model="lineColor"/></div>
        <select class="colorSelect same" v-model="lineWidth">
          <option v-for="n in 25" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>
      <div class="line"></div>

      <!-- 4 -->
      <div class="itemBox">
        <div
            class="item"
            v-for="(k, i) in fourth" :key="k"
            @click="changedEvent(i)"
        >
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
      </div>
      <div class="line"></div>

      <!-- 5 -->
      <div class="itemBox">
        <div class="implant">
          <img src="@/assets/img/utils/icon-implant.png"/>
          <span class="same">임플란트 식립</span>
        </div>
        <!--        <div
                    class="item"
                    v-for="(v, k) in fifth" :key="k"
                    @click="fifth[k] = !v"
                    :class="{isToggle:v}"
                >
                  <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
                </div>-->
      </div>
      <div class="line"></div>

      <!-- 6 -->
      <!--      <div class="itemBox">
              <div
                  class="item"
                  v-for="(v, k) in sixth" :key="k"
                  @click="sixth[k] = !v"
                  :class="{isToggle:v}"
              >
                <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
              </div>
            </div>
            <div class="line"></div>-->

      <!-- 7 -->
      <span class="same" style="padding: 0 0 0 3px;">초기화</span>
      <div class="itemBox">
        <button class="item bar same" @click.prevent="$refs.VueCanvasDrawing.undo()">Undo</button>
        <button class="item bar same" @click.prevent="$refs.VueCanvasDrawing.redo()">Redo</button>

        <!-- 회전 초기화-->
        <button class="item bar same" @click="clearView">뷰</button>
        <!-- 회전, 그림 초기화-->
        <button class="item bar same" @click="clearView" @click.prevent="$refs.VueCanvasDrawing.reset()">전체</button>
      </div>
    </div>
    <div class="baseUtilityView">

      <div class="mainPrintView" id="canvas">
        <img :src="mainImg" :class="{ sharpen:second['sharpen'] }" class="mainImg utilityEvent"/>

        <VueDrawingCanvas
            ref="VueCanvasDrawing"
            v-model:image="image"
            :stroke-type="strokeType"
            :fill-shape="fillShape"
            :backgroundImage="backgroundImage"
            :height="fullWidth"
            :width="fullWidth"
            :lock="lock"
            :color=lineColor
            :lineWidth=lineWidth
            @mousedown="downFlag = !downFlag, startCoordinate($event)"
            @mousemove="changedMouseEvent($event)"
            @mouseup="downFlag = !downFlag, endCoordinate($event)"
            @wheel="changedScale"
            saveAs="png"
            line-cap="round"
            line-join="round"
            :initial-image="initialImage"
            classes="canvasEvent"
            :styles="{
              border: 'solid 1px #FF0000',
              position: 'absolute',
              top: '-' + halfWidth + 'px',
            }"
        />
      </div>
      <div class="thumbnail" :class="{ thumbList:btnchg }">
        <div class="filterBtns" :class="{ filterCng:btnchg }">
          <div>
          <span class="filterName">Date {{ brightness }}
            <!-- x-axis: <strong>{{ x }}</strong>, y-axis: <strong>{{ y }}</strong> -->
          </span>
            <select class="filterSelect">
              <option>All</option>
            </select>
          </div>
          <div>
            <span class="filterName">Modality</span>
            <select class="filterSelect">
              <option>All</option>
            </select>
          </div>
        </div>
        <div id="thumbnailList" class="thumbnailList" :class="{ ListCng:btnchg }">
          <div class="thumbnailBtn" @click="btnchg = !btnchg"> {{ btnchg ? "▲" : "▼" }} Thumbnail {{ scale }}{{ x }}
            {{ y }}
          </div>
          <div id="thumbnails" class="thumbnails" :class="{ thumbnailsCng:btnchg }">
            <div id="imgBox" class="imgBox"
                 @click="showInfo(node, i, $event)"
                 v-for="(node, i) in imageArr"
                 :key="i">
              <img class="imgs" :src="node.images" style="pointer-events: none;" alt=""/>
              <div v-if="first.info" class="info">
                데이터 전처리 필요 <br>
                Chart Id:: {{ dataInfo.chartId }} <br>
                Unix Time:: {{ dataInfo.time }} <br>
                <!-- {{ imageArr }} -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/utility.css'
import {xmlToJson} from '@/assets/js/x2j.js'

import axios from "axios"
import drf from '@/api/drf'
import {mapGetters, mapActions} from 'vuex';
import Constant from "@/common/Constant.js";
import VueDrawingCanvas from "vue-drawing-canvas";

export default {
  name: 'BaseUtilityView',

  components: {
    VueDrawingCanvas,
  },

  props: {},

  data: () => ({
    cnt: 0,

    // utility ===================================================
    lock: true,
    // 1
    imageArr: [],
    dataInfo: {},

    scale: 1.0,
    // 1-3
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,

    // 2
    brightness: 100,
    inverse: 0,
    // 3
    lineColor: '#FF0000',
    lineWidth: 1,
    // 4
    ang: 0,
    rotX: 0,
    rotY: 0,

    // 1 f
    first: {
      pan: false,
      zoom: false,
      info: false
    },
    // 2 s
    second: {
      bright: false,
      inverse: false,
      sharpen: false,
      ruler: false,
      tapeline: false,
      angle: false,
      arrow: false,
      shape: false,
      rectangle: false,
    },
    // 3 t
    third: {draw: true, nerve: true},
    // 4 o
    fourth: ['01', '02', '03', '04'],
    // 5 i
    // fifth: {'implant-01': false, 'implant-02': false, pontic: false},
    // 6 x
    // sixth: {'select-capture': false, 'full-screen-capture': false, 'window-capture': false},

    // base ===================================================
    // canvas height, width
    fullHeight: 0,
    fullWidth: 0,
    halfWidth: 0,

    // thumbnail static width
    thumbnailsWidth: 0,

    preImage: '',
    btnchg: false,

    mainImg: 'https://png.pngtree.com/background/20210714/original/pngtree-pure-black-dark-background-wallpaper-picture-image_1218983.jpg',

    // canvas
    initialImage: [
      {
        type: "dash",
        from: {
          x: 262,
          y: 154,
        },
        coordinates: [],
        color: '#FF0000',
        width: 1,
        fill: false,
      },
    ],

    downFlag: false,
    x: 0,
    y: 0,
    preX: 0,
    preY: 0,
    image: "",
    strokeType: "dash",
    fillShape: false,
    backgroundImage: null,
  }),

  mounted() {
    this.fullHeight = document.getElementById('canvas').clientHeight - 2;
    this.fullWidth = document.getElementById('canvas').clientWidth - 2;
    this.halfWidth = (this.fullWidth - this.fullHeight) / 2;

    this.thumbnailsWidth = document.getElementById('thumbnailList').clientWidth;
    if ("vue-drawing-canvas" in window.localStorage) {
      this.initialImage = JSON.parse(
          window.localStorage.getItem("vue-drawing-canvas")
      );
    }
  },

  computed: {
    ...mapGetters([
      'patientSeriesList',
    ]),
  },

  watch: {
    patientSeriesList: {
      deep: true,
      handler() {
        this.mainImg = 'https://png.pngtree.com/background/20210714/original/pngtree-pure-black-dark-background-wallpaper-picture-image_1218983.jpg';
        this.imageArr = [];

        const ch = this.patientSeriesList.chartId;
        this.patientSeriesList.entity.forEach(async e => {
          // create time
          const cr = e.Created;

          // image
          const url = await axios({
            url: drf.patient.patientImgFileDownload(e.UniqueID),
            method: 'get',
            // headers: {
            //   "Content-Type": "multipart/form-data"
            // }
            responseType: 'blob',
          })
          const im = URL.createObjectURL(new Blob([url.data], {type: 'image/bmp'}));

          let pw, ph;
          // api 호출
          // const url = "url 데이터";
          // const reqURL = `${url}${ENCODING_API_KEY}`;
          // const response = await fetch(reqURL);
          // const xmlString = await ;
          let XmlNode = new DOMParser().parseFromString(e.Tags, "text/xml");
          const json = xmlToJson(XmlNode);
          pw = json.tags.tags[0].tag[0]["@attributes"].value;
          ph = json.tags.tags[0].tag[1]["@attributes"].value;

          // PixelSpacing
          const h = e.PixelSpacingH;
          const v = e.PixelSpacingV;

          this.imageArr.push({
            chartId: ch,
            images: im,
            create: cr,
            pw: pw,
            ph: ph,
            PixelSpacingH: h,
            PixelSpacingW: v
          })
        })

        // this.imageArr = [];
        // this.mainImg = ' ';
        // this.patientSeriesList.forEach(async instanceID => {
        //   const url = await axios({
        //     url: drf.patient.patientImgFileDownload(instanceID),
        //     method: 'get',
        //     // headers: {
        //     //   "Content-Type": "multipart/form-data"
        //     // }
        //     responseType: 'blob',
        //   })
        //   const re = URL.createObjectURL(new Blob([url.data], {type: 'image/bmp'}));
        //   this.imageArr.push(re);
        // })
      }
    }
  },

  created() {
  },

  methods: {
    // utility ===================================================
    // 1-2
    changedScale(e) {
      if (this.first.zoom) {
        const rate = 0.002;
        if (e.deltaY > 0 && this.scale >= 0.5 + rate) this.scale -= rate;
        else if (e.deltaY < 0 && this.scale <= 2.0 - rate) this.scale += rate;
      }
    },

    // 1-3
    showInfo(node, idx, e) {
      if (this.preImage !== '') {
        this.preImage.setAttribute('style', '');
      }

      this.mainImg = node.images;
      e.target.setAttribute('style', 'border: 2px solid blue');
      this.preImage = e.target;

      this.pS = node.PixelSpacingH;
      this.pW = node.pw;
      this.dataInfo = {
        'chartId': node.chartId,
        'time': node.create,
      }
    },

    // 1-4
    startCoordinate(e) {
      this.getCoordinate(e);
      this.startX = this.x;
      this.startY = this.y;
    },

    endCoordinate(e) {
      if (this.second.ruler) {
        this.getCoordinate(e);
        this.endX = this.x;
        this.endY = this.y;
        const rate = this.pW / this.fullHeight;
        // const pixelSpacing = 0.10000000149011612;
        const pixelSpacing = this.pS;
        const distance = Math.pow(Math.pow(this.startY - this.endY, 2) + Math.pow(this.startX - this.endX, 2), 0.5) * rate * pixelSpacing;
        console.log(distance);
      }
    },

    // 2-1, 2-3
    changedMouseEvent(e) {
      if (this.downFlag && this.second.bright) {
        this.cnt++;
        this.preX = this.x;
        this.preY = this.y;
        this.getCoordinate(e);
        if (this.preX < this.x || this.preY < this.y) {
          this.brightness += 2;
        } else if (this.preX > this.x || this.preY > this.y) {
          this.brightness -= 2;
        }
      }
    },

    // event
    // 2-2, 4-1, 4-2, 4-3, 4-3
    changedEvent(e) {
      if (e === 'inverse') {
        // Change Inverse
        // 2-2
        if (this.second[e] === true) this.inverse = 100;
        else this.inverse = 0;
      } else {
        // Change Angle
        // 4-1, 4-2, 4-3, 4-4
        // @click="utilityEvent(i), send({'name' : k, 'state' : i }, [ang, rotX, rotY])"
        if (e === 0) {
          this.ang = (this.ang + 90) % 360
        } else if (e === 1) {
          if (this.ang === 0) this.ang = 360;
          this.ang = (this.ang - 90) % 360
        } else if (e === 2) {
          if (this.ang === 90 || this.ang === 270) {
            this.rotX = (this.rotX % 360) + 180;
          } else {
            this.rotY = (this.rotY % 360) + 180;
          }
        } else if (e === 3) {
          if (this.ang === 0 || this.ang === 180) {
            this.rotX = (this.rotX % 360) + 180;
          } else {
            this.rotY = (this.rotY % 360) + 180;
          }
        }
      }
    },

    // 2-4, 2-8, 2-9, 3-1
    changedStrokeType(s) {
      if (s === 'ruler') {
        this.strokeType = 'line';
        this.lock = this.second.rectangle;
      } else if (s === 'shape') {
        this.strokeType = 'circle';
        this.lock = !this.second.shape;
      } else if (s === 'rectangle') {
        this.strokeType = 'square';
        this.lock = !this.second.rectangle;
      } else if (s === 'draw') {
        this.strokeType = 'dash';
        this.lock = this.third.draw;
      }
    },

    // 7-1, 7-2
    clearView() {
      this.brightness = 100;
      this.inverse = 0;

      this.ang = 0;
      this.rotX = 0;
      this.rotY = 0;
    },

    // base ===================================================
    ...mapActions([
      Constant.GET_PATIENTSERIESLIST,
    ]),

    // async setImage(event) {
    //   let URL = window.URL;
    //   this.backgroundImage = URL.createObjectURL(event.target.files[0]);
    //   await this.$refs.VueCanvasDrawing.redraw();
    // },

    getCoordinate(event) {
      let coordinates = this.$refs.VueCanvasDrawing.getCoordinates(event);
      this.x = coordinates.x;
      this.y = coordinates.y;
    },
  },
}
</script>

<style>
.baseHeaderView {
  background-color: orange;
  width: 100%;
  height: 100%;
  display: flex;
}

/*  =============================================================== */
.baseUtilityView {
  background-color: gray;
  height: 718px;
  width: 100%;
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
}

.info {
  /*width: 184px;*/
  /*height: 66px;*/
  top: 10px;
  left: 10px;
  /*margin: 5px 1424px 632px 0;*/
  text-shadow: 1px 0 1px #000;
  font-family: MalgunGothic;
  position: absolute;
  overflow: hidden;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: -0.64px;
  color: #fff;
}

.mainPrintView {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.mainImg {
  /*border: 1px solid blue;*/
  height: calc(1px * v-bind(fullHeight));
  width: calc(1px * v-bind(fullHeight));
  position: absolute;
  left: calc(1px * ((v-bind(fullWidth) - v-bind(fullHeight)) / 2));
  /*z-index: 10;*/
}


.thumbnail {
  display: flex;
  flex-direction: row;
  height: 140px;
  width: auto;
}

.filterBtns {
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

.thumbnailList {
  width: 100%;
  height: auto;
  background-color: #f4f6f9;
  display: flex;
  flex-direction: column;
}

.thumbnailBtn {
  height: 16px;
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

.thumbnails {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: calc(1px * v-bind(thumbnailsWidth));
  flex-wrap: nowrap;
  overflow-x: auto;
  align-items: center;
  height: 124px;
  background-color: #f4f6f9;
}

.imgBox {
  display: flex;
  width: 160px;
  margin: 0 0 0 8px;
  border: solid 1px #d5dae5;
  background-color: #eaecf2;
  flex: 0 0 auto;
}

.imgs {
  margin: 0 auto;
  width: 90px;
  height: 89px;
}

/* HS */
.thumbList {
  height: 16px;
}

.ListCng {
  height: auto;
}

.filterCng {
  display: none;
}

.thumbnailsCng {
  display: none;
}

/* end */

.isToggle {
  border: solid 2px blue;
}

.utilityEvent {
  /* 1-1 */
  /* filter: translate(calc(1% * v-bind('inverse') / 6)); */
  overflow: hidden;
  /* */
  /* 2-1, 2-2, */
  filter: brightness(calc(1% * v-bind(brightness))) invert(calc(1% * v-bind(inverse)));

  /* 1-2, 4-1, 4-2, 4-3, 4-4 */
  transform: scale(v-bind('scale')) rotate(calc(1deg * v-bind(ang))) rotateX(calc(1deg * v-bind(rotX))) rotateY(calc(1deg * v-bind(rotY)));
}

/* 2-3 */
.sharpen {
  image-rendering: pixelated;
}

.canvasEvent {
  z-index: 10;

  transform: scale(v-bind('scale')) rotate(calc(1deg * v-bind(ang))) rotateX(calc(1deg * v-bind(rotX))) rotateY(calc(1deg * v-bind(rotY)));
}
</style>
