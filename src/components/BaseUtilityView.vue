<template>
  <div class="baseUtilityView">
    <div class="mainPrintView">
      <img class="mainImg" :src="mainImg" :class="{isThT:status}" />
    </div>
    <div class="thumbnail">
      <div class="filterBtns">
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

      <div class="thumbnailList">
        <div class="thumbnailBtn">▼ Thumbnail</div>
        
        <div class="thumbnails">
          <div class="imgBox" 
            @click="[mainImg = imgs, isActive=!isActive]"
            :class="{isToggle:isActive}"
            v-for="pPL in patientPictureList"
            :key="pPL"
            >{{getImages(pPL)}}
            <!-- <img class="img" :src="getImages(pPL)" style="pointer-events: none;"/> -->
          </div>
          <div class="imgBox" @click="movedImgfile()" >
            <img class="img" :src="iii"/>
          </div>

          <div class="imgBox" @click="movedImgfile()" >
            <img class="img"  :src="imgs"/>
          </div>
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
    'status',
  ],

  data: () => ({
    mainImg: ' ',
    isActive: false,
    iii: ' ',
  }),

  computed: {
    ...mapGetters([
      'patientPictureList',
    ]),
  },

  created() {
  },

  methods: {
    ...mapActions([
      Constant.GET_PATIENTPICTURELIST,
    ]),

    getImages(instanceID) {
      // console.log(instanceID);
      return new Promise(function(resolve, reject){
        axios({
          url: drf.patient.patientImgFileDownload(instanceID),
          method: 'get',
          // headers: {
          //   "Content-Type": "multipart/form-data"
          // }
          responseType: 'blob',
          timeout: 5000,
        }).then(res => {
          const blob = URL.createObjectURL(new Blob([res.data], {type:'image/bmp'}));
          console.log(blob);
          resolve(blob)
        })
        .catch((error) => {
          reject(error);
        });
      });
    },

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
    height: 700px;
    margin: 0 auto;
  }

  .mainImg {
    height: 700px;
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
    color: #96a2b3;
  }

  .thumbnails{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    height: 124px;
    padding: 9px 0 6px 10px;
    background-color: #f4f6f9;
  }

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

  /* 2-2 */
  .isThT {
    filter: invert(100%);
  }
</style>
