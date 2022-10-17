// import { login, findById } from "@/api/member.js";
import drf from '@/api/drf'
import Constant from "@/common/Constant.js";
import { createStore } from 'vuex'
import axios from "axios"

export default createStore({
  state: {
    // [] 배열, {} 맵
    patientNameList: [],

    patientPictureList: [],

    patientRecordList: [],

    patientRecordFilenameList: [],

    picture: '',

    imgs: [],
  },

  getters: {
    patientNameList: state => state.patientNameList,

    patientPictureList: state => state.patientPictureList,

    patientRecordList: state => state.patientRecordList,

    patientRecordFilenameList: state => state.patientRecordFilenameList,

    picture: state => state.picture,

    imgs: state => state.imgs,
  },

  mutations: {
    [Constant.SET_PATIENTNAMELIST]: (state, patientNameList) => state.patientNameList = patientNameList,

    [Constant.SET_PATIENTPICTURELIST]: (state, patientPictureList) => state.patientPictureList = patientPictureList,

    [Constant.SET_PATIENTRECORDLIST]: (state, patientRecordList) => state.patientRecordList = patientRecordList,

    [Constant.SET_PATIENTRECORDFILENAMELIST]: (state, patientRecordFilenameList) => state.patientRecordFilenameList = patientRecordFilenameList,

    [Constant.SET_PICTURE]: (state, picture) => state.picture = picture,

    [Constant.SET_IMGS]: (state, imgs) => state.imgs = imgs,
  },

  actions: {
    [Constant.GET_PATIENTNUMLIST]({ commit }) {
      axios({
        url: drf.patient.patientNumList(),
        method: 'get'
      })
      .then(res => {
        commit(Constant.SET_PATIENTNUMLIST, res.data.Result.Entities)
      })
      .catch(err => console.error(err))
    },

    // async 실험
    // [Constant.GET_PATIENTNAMELIST]({ commit }, param) {
    //   const getName = (param) => {
    //     const newArr = async() => {
    //       await axios({
    //         url: drf.patient.patientNameList(param),
    //         method: 'get'
    //       })
    //       .then(res => {
    //         const datas = res.data.Result.Entities;
    //         console.log(datas);
    //         commit(Constant.SET_PATIENTNAMELIST, datas)
    //       })
    //       .catch(err => console.error(err))
    //     }

    //     this.patientNameList.map(element => {
    //       axios({
    //         url: drf.patient.patientName(element),
    //         method: 'get'
    //       })
    //       .then( res => {
    //         const name = res.data.Result;
    //         // console.log(`${name.FirstName} ${name.LastName}`);
    //         return `${name.FirstName} ${name.LastName}`;
    //       })
    //       .catch(err => console.error(err))
    //     })

    //     return newArr;
    //   }
      
    //   console.log(getName(param));
    // },


    [Constant.GET_PATIENTNAMELIST]({ commit }, param) {
      axios({
        url: drf.patient.patientNameList(param),
        method: 'get'
      })
      .then(res => {
        const datas = res.data.Result.Entities;

        // datas.map(element => {
        //   axios({
        //     url: drf.patient.patientName(element),
        //     method: 'get'
        //   })
        //   .then( res => {
        //     const name = res.data.Result;
        //     // console.log(`${name.FirstName} ${name.LastName}`);
        //     return `${name.FirstName} ${name.LastName}`;
        //   })
        //   .catch(err => console.error(err))
        // })

        commit(Constant.SET_PATIENTNAMELIST, datas)
        
      })
      .catch(err => console.error(err))
    },

    // getName 
    [Constant.GET_PATIENTNAME](...uid) {
      axios({
        url: drf.patient.patientName(uid),
        method: 'get'
      })
      .then(res => {
        const data = res.data.Result;
        console.log(`${data.FirstName} ${data.LastName}`);
        return `${data.FirstName} ${data.LastName}`;
      })
      .catch(err => console.error(err))
    },

    [Constant.GET_PATIENTPICTURELIST]({commit}, uid) {
      console.log(drf.patient.patientPictureList(uid));
      axios({
        url: drf.patient.patientPictureList(uid),
        method: 'get'
      })
      .then(res => {
        commit(Constant.SET_PATIENTPICTURELIST, res.data.Result.Entities);
        const datas = res.data.Result.Entities;
        
        // ================================================
        datas.forEach(element => {
          axios({
            url: drf.patient.patientSeriesNum(element),
            method: 'get'
          })
          .then(res => {
            console.log('patientImgFileDownload');
            console.log(res.data.Result.Entities);
            axios({
              url: drf.patient.patientImgFileDownload(res.data.Result.Entities),
              method: 'get',
              // headers: {
              //   "Content-Type": "multipart/form-data"
              // }
              responseType: 'blob'
            })
            .then(res => {
              console.log(res);
              console.log(res.data);
              const blob = URL.createObjectURL(new Blob([res.data], {type:'image/bmp'}));
              commit(Constant.SET_IMGS, blob);
            });
          });
        });
        // context.state.imgs = newArr;
        // console.log(context.state.imgs);
        // console.log(newArr);
        // ================================================
      })
      .catch(err => console.error(err))
    },

    [Constant.GET_IMGS]() {
      return this.state.imgs;
    },

    [Constant.GET_PATIENTSERIESNUM]({ commit }, study) {
      console.log(drf.patient.patientSeriesNum(study));
      axios({
        url: drf.patient.patientSeriesNum(study),
        method: 'get'
      })
      .then(res => {
        console.log(res.data.Result.Entities);
        commit(Constant.SET_PATIENTPICTURELIST, res.data.Result.Entities)
      })
      .catch(err => console.error(err))
    },

    [Constant.GET_PATIENTRECORDLIST]({ commit }, p_uid) {
      axios({
        url: drf.patient.patientRecordList(p_uid),
        method: 'get'
      })
      .then(res => {
        console.log(res.data.Result.Entities);
        commit(Constant.SET_PATIENTRECORDLIST, res.data.Result.Entities)
      })
      .catch(err => console.error(err))
    },

    
    [Constant.GET_PATIENTRECORDFILENAMELIST]({ commit }, datas) {
      axios({
        url: drf.patient.patientRecordFilenameList(datas.pn, datas.ix),
        method: 'get'
      })
      .then(res => {
        commit(Constant.SET_PATIENTRECORDFILENAMELIST, res.data.patientRecordFilenameList)
      })
      .catch(err => console.error(err))
    },

    [Constant.GET_PICTURE]({ commit }, datas) {
      axios({
        url: drf.patient.picture(datas.pn, datas.fn),
        method: 'get'
      })
      .then(res => {
        console.log(res);
        commit(Constant.SET_PICTURE, res.data)
      })
      .catch(err => console.error(err))
    }
  },

  modules: {
  }
})
