// devServer: {
//   proxy : 'http://127.0.0.1:16124/oov/svc/native/1.0/'
// }
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
  },
}
