// const HOST = 'http://127.0.0.1:16124/oov/svc/native/1.0/patient/json/'
// devServer: {
//   proxy : 'http://127.0.0.1:16124/oov/svc/native/1.0/'
// }
// http://127.0.0.1:16124/oov/svc/native/1.0/patient/json/search/uids/token?param=
// http://127.0.0.1:16124/oov/svc/native/1.0/study/json/search/uid/patient/793E348D1EBD4CBB91AB76C35911A897
export default {
  patient: {
    allPatientList: () => `patient/json/search/all`,
    patientSeriesList: (chartId) => `misc/json/search/patient/id/params?p_id=${chartId}&all=true`,
    patientRecordList: (p_uid) => `study/json/search/uid/patient/${p_uid}`,

    // No index.js
    patientImgFileDownload: (instanceID) => `download_instance/instanceJPG/uid/${instanceID}.1`,
    drawImage: (instanceID) => `download_instance/instance/config/uid/param?uid=${instanceID}.1`,
    getPatientInfo: (instanceID) => `patient/json/get/uid/${instanceID}`,

    // Save drawing marker
    saveDrwingMarker: (instanceID) => `upload_instance/instance/config/uid/param?uid=${instanceID}.1`,

    // patientName: (uid) => `patient/json/get/uid/${uid}`,
    // patientPictureList: (uid) => `study/json/search/uid/patient/${uid}`,
    // patientSeriesNum: (study) => `series/json/search/uid/study/${study}`,
    // patientThumbnail: (seriesNum) => `download_instance/instance/thumb/params?uid=${seriesNum}.1&type=1`,
    // patientRecordList: (pn) => HOST + `patient/select/list/record/${pn}`,
    // patientRecordList: () => 'study/json/search/uid/patient/793E348D1EBD4CBB91AB76C35911A897',
    // patientRecordFilenameList: (pn, ix) => HOST + `patient/select/list/filename/${pn}/${ix}`,
    // picture: (pn, fn) =>HOST + `patient/select/picture/${pn}/${fn}`,
  },
}
