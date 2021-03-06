import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import typeMessage from './components/typeMessage.vue';
import message from './components/message.vue';
import VuePaginate from 'vue-paginate';
import messageDetail from './components/messageDetail.vue';
import filtre from './components/filtre.vue';
import OrigineMessage from './components/OrigineMessage.vue';
import CHCNPagination from './components/pagination.vue';

Vue.use(BootstrapVue);
Vue.component('typeMessage', typeMessage);
Vue.component('message', message);
Vue.component('messageDetail', messageDetail);
Vue.component('filtreCHCN', filtre);
Vue.component('OrigineMessage', OrigineMessage);
Vue.component('CHCNPagination', CHCNPagination);
Vue.use(VuePaginate);

import * as io from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const config = require('../config/config');

var socket = io.connect(config.addressio, {reconnect : true, origins : '*:* srv-webdev:*'});
socket.emit('reqListChan');
var main = null;
socket.on('listChan', (data, headers) => {
  if (typeof data === 'string')
    data = JSON.parse(data);

  new Vue({
    el: '#app',
    render: h => h(App, {
      props: {
        listChan:data,
        socket : socket
      }
    })
  });

})
