<template>
  <table class="imageList">
    <tr>
      <th>-</th>
      <th>목차</th>
      <th>모달리티</th>
      <th>이미지</th>
      <th>이동</th>
    </tr>
    <tr v-for="(item, index) in imageArr" :key="item.image">
      <td><input type="checkbox" class="checkboxs"/></td>
      <td><span v-html="index + 1"></span></td>
      <td>{{ item.modal }}</td>
      <td><img :src="item.image" class="img" alt="image"></td>
      <td>
        <router-link :to="{ name: 'CanvasView', params: { image: item.image }}">이동</router-link>
      </td>
    </tr>
  </table>
</template>

<script>
// import '@/assets/css/utility.css';
// import {xmlToJson} from '@/assets/js/x2j.js';
import axios from "axios";
import drf from '@/api/drf';
import {mapGetters, mapActions} from 'vuex';
import Constant from "@/common/Constant.js";

export default {
  name: 'ImageListView',

  components: {},

  data: () => ({
    imageArr: [],

    map: {
      'OV_IST_00_00': 'Unknown',
      'OV_IST_01_00': 'CT',
      'OV_IST_02_00': 'Pano',
      'OV_IST_03_00': 'Ceph',
      'OV_IST_04_00': 'IO_Xray',
      'OV_IST_05_00': 'IO_Camera',
      'OV_IST_06_00': 'External_camera',
      'OV_IST_09_00': 'ETC',
    }
  }),


  mounted() {
  },

  computed: {
    ...mapGetters([
      'patientRecordList',
      'patientSeriesList',
    ]),
  },

  watch: {
    patientSeriesList: {
      deep: true,
      async handler() {
        this.imageArr = [];
        for (let e of this.patientSeriesList.entity) {
          console.log(e);
          const url = await axios({
            url: drf.patient.patientImgFileDownload(e.UniqueID),
            method: 'get',
            responseType: 'blob',
          })
          const blobImage = URL.createObjectURL(new Blob([url.data], {type: 'image/bmp'}));
          this.imageArr.push({
            image: blobImage,
            modal: this.map[e.ModalitySubType],
          });
          // console.log(blobImage);
          // window.onload = function () {
          //   this.context.drawImage(blobImage, 0, 0, 1000, 1000);
          // }

          // 마커 정보 가져오기
          // const markCoordinate = await axios({
          //   url: drf.patient.drawImage(e.UniqueID),
          //   method: 'get',
          //   headers: {
          //     "Content-Type": "multipart/form-data"
          //   }
          // })

          // 그림 정보 가져오기
          // // xml to json
          // let XmlNode = new DOMParser().parseFromString(e.Tags, "text/xml");
          // const json = xmlToJson(XmlNode);
          // this.realityImageWidth = (json.tags.tags[0].tag[0]["@attributes"].value * e.PixelSpacingV) / 25.4 * this.DPI;
          // this.realityImageHeight = (json.tags.tags[0].tag[1]["@attributes"].value * e.PixelSpacingH) / 25.4 * this.DPI;

          // // 이미지 마다 다른 것
          // this.imageArr.push({
          //   // 차트ID
          //   chartId: chartId,
          //   // 마커 정보
          //   images: blobImage,
          //   // 마커 파일
          //   drawMark: markCoordinate,
          //   // 생성 일자
          //   create: createdTime,
          //   // 너비
          //   ph: this.realityImageWidth,
          //   // 높이
          //   pw: this.realityImageHeight,
          //   // 마커 배열
          //   overlaies: markCoordinate.data === '' ? [] : markCoordinate.data.overlaies,
          // })
          // this.disable = true;

          // 환자 정보
          // await axios({
          //   url: drf.patient.getPatientInfo('4629CF54C49549F59AFBB99D9FC82D8F'),
          //   method: 'get',
          // }).then(res => {
          //   console.log(res.data.Result);
          //   this.patientInfo = res.data.Result;
          // })
        }
      }
    }
  },

  methods: {
    ...mapActions([
      Constant.GET_PATIENTRECORDLIST,
      Constant.GET_PATIENTSERIESLIST,
    ]),
  }
}
</script>

<style>
.imageList {
  width: 100%;
}

table {
  text-align: left;
}

table th {
  /* padding : 12px; */
  border-bottom: 2px solid darkgray;
}

table td {
  padding: 1px;
}

table tr:nth-of-type(even) {
  background-color: #eaeff3;
}

.img {
  height: 65px;
  width: 100px;
}
</style>