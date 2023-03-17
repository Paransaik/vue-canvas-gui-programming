<template>
    <table class="imageList">
        <tr>
            <th>-</th>
            <th>목차</th>
            <th>이미지</th>
        </tr>
        <tr v-for="(item, index) in imageArr" :key="item">
            <td><label><input type="checkbox" class=""/></label></td>
            <td><span v-html="index + 1"></span></td>
            <td><img :src="item" class="img"></td>
        </tr>
    </table>
</template>
  
<script>
//   import '@/assets/css/utility.css';
// import {xmlToJson} from '@/assets/js/x2j.js';
import axios from "axios";
import drf from '@/api/drf';
import { mapGetters, mapActions } from 'vuex';
import Constant from "@/common/Constant.js";

export default {
    name: 'ImageListView',

    components: {},

    data: () => ({
        imageArr: [],
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
                for (let e of this.patientSeriesList.entity) {
                    const url = await axios({
                        url: drf.patient.patientImgFileDownload(e.UniqueID),
                        method: 'get',
                        responseType: 'blob',
                    })
                    const blobImage = URL.createObjectURL(new Blob([url.data], { type: 'image/bmp' }));
                    this.imageArr.push(blobImage);
                    console.log(blobImage);
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
    text-align : left;
}

table th{
    /* padding : 12px; */
    border-bottom: 2px solid  darkgray;
}

table td{
    padding : 1px;
}

table tr:nth-of-type(even){
    background-color: #eaeff3;
}

.img {
    height: 65px;
    width: 100px; 
}
</style>