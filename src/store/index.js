// import { login, findById } from "@/api/member.js";
import drf from '@/api/drf'
import Constant from "@/common/Constant.js";
import { createStore } from 'vuex'
import axios from "axios"

export default createStore({
  state: {
    // [] 배열, {} 맵
    allPatientList: [],

    patientSeriesList: {},

    patientRecordList: [],

    patientRecordFilenameList: [],
  },

  getters: {
    allPatientList: state => state.allPatientList,

    patientSeriesList: state => state.patientSeriesList,

    patientRecordList: state => state.patientRecordList,

    patientRecordFilenameList: state => state.patientRecordFilenameList,
  },

  mutations: {
    [Constant.SET_ALLPATIENTLIST]: (state, allPatientList) => state.allPatientList = allPatientList,

    [Constant.SET_PATIENTSERIESLIST]: (state, patientSeriesList) => state.patientSeriesList = patientSeriesList,

    [Constant.SET_PATIENTRECORDLIST]: (state, patientRecordList) => state.patientRecordList = patientRecordList,

    [Constant.SET_PATIENTRECORDFILENAMELIST]: (state, patientRecordFilenameList) => state.patientRecordFilenameList = patientRecordFilenameList,
  },

  actions: {
    [Constant.GET_ALLPATIENTLIST]({ commit }) {
      axios({
        url: drf.patient.allPatientList(),
        method: 'get'
      })
      .then(res => {
        commit(Constant.SET_ALLPATIENTLIST, res.data.Result.Entities)
      })
      .catch(err => console.error(err))
    },

    [Constant.GET_PATIENTSERIESLIST]({commit}, uid) {
      // uid.target.value = chartID
      axios({
        url: drf.patient.patientSeriesList(uid.target.value),
        method: 'get'
      })
      .then(res => {
        // res.data.Result.SeriesList.Entities = instanceUid list
        const datas = {
          entity: res.data.Result.SeriesList.Entities,
          chartId: uid.target.value
        }
        // const newArr = datas.map(element => {
        //   return element.UniqueID;
        // });
        // console.log(newArr);
        commit(Constant.SET_PATIENTSERIESLIST, datas);
      })
      .catch(err => console.error(err))
    },

    [Constant.GET_PATIENTRECORDLIST]({ commit }, p_uid) {
      axios({
        url: drf.patient.patientRecordList(p_uid),
        method: 'get'
      })
      .then(res => {
        // console.log(res.data.Result.Entities);
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
  },

  modules: {
  }
})
