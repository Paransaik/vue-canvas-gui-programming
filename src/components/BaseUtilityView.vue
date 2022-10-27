<template>
  <div class="baseUtilityView">

    <div class="mainPrintView">
      <!-- <img class="mainImg" :src="mainImg" :class="{isThT:probsdata.status}" /> -->
      <img class="mainImg utilityEvent" 
      :src="mainImg"
      /> 
    <!-- :class="{isOhFSTO: probsdata.name === '01' || probsdata.name === '02',
                isOhT: probsdata.name === '03',
                isOhO: probsdata.name === '04'}" -->
    </div>
    <div class="thumbnail" :class="{thumbList:btnchg}">
      <div class="filterBtns" :class="{filterCng:btnchg}">
        <div>
          <span class="filterName">Date</span>
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
      <div class="thumbnailList" :class="{ListCng:btnchg}">
    
      <div class="thumbnailBtn" 
        @click="btnchg = !btnchg"> {{ btnchg ? "▲" : "▼" }} Thumbnail {{ probsdata.inverse }} </div>
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

export default {
  name: 'BaseUtilityView',

  props: [
    'probsdata',
  ],

  data: () => ({
    mainImg: ' ',
    isActive: false,
    iii: '',
    btnchg : false,
  }),

  computed: {
    ...mapGetters([
      'patientSeriesList',
      'blobImgList',
    ]),
    

  },

  created() {
  },

  methods: {
    ...mapActions([
      Constant.GET_PATIENTSERIESLIST,
      Constant.GET_BLOBIMGS,
    ]),

    getImg(p) {
      const imgBox = document.getElementById('thumbnails');
      return axios({
          url: drf.patient.patientImgFileDownload(p),
          method: 'get',
          responseType: 'blob',
        }).then(res => {
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
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: black;
  }

  .mainPrintView {
    height: 100%;
    margin: 0 auto;
  }

  .mainImg {
    height: 100%;
  }

  .thumbnail {
    display: flex;
    flex-direction: row;
    height: 140px;
    width: auto;
    border: solid 1px #adbed9
  }

  .filterBtns{ 
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 148px;
    height: 138px;
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
    padding: 0px 0px;
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
    /* filter: translate(calc(1% * v-bind('probsdata.inverse') / 6)); */

    /* 1-2 */
    /* filter: scale(calc(1% * v-bind('probsdata.inverse') / 6)); */

    /* 2-1 */
    /* filter: brightness(calc(1% * v-bind('probsdata.inverse') / 6)); */

    /* 2-2 */
    /* filter: invert(calc(1% * v-bind('probsdata.inverse'))); */
    

    /* 4-1, 4-2, 4-3, 4-4*/
    transform: rotate(calc(1deg * v-bind('probsdata.angle[0]'))) 
                rotateX(calc(1deg * v-bind('probsdata.angle[1]'))) 
                rotateY(calc(1deg * v-bind('probsdata.angle[2]')));
  }

</style>
