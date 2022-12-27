// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,

//   devServer: {
//     proxy : 'http://127.0.0.1:16124/oov/svc/native/1.0/patient/json/'
//   }
// })

module.exports = {
  devServer: {
    proxy : 'http://127.0.0.1:16124/oov/svc/native/1.0/'
  }
}

