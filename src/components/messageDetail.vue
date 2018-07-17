<template>

  <b-modal ref="modalDetailMessage"
            size="lg"
             ok-only
             header-bg-variant="dark"
             header-text-variant="light"
              title="Détail du message">
      
    <b-container v-if="message != null">
      <message class="hMessage" :message="message" :priority="priority"></message>
      <b-container id="divURLs" class="detail alert alert-success hMessage" v-bind:class="showURL() ? '' : 'hidden'">
        <b-container>Listes des solutions proposée(s) : </b-container>
        <ul>
          <li v-for="url in listURL" v-bind:key="url"><a v-bind:href="url" target="blank">{{url}}</a></li>
        </ul>
        
      </b-container>
      <b-container class="detail">
        <div v-html="formatedMessage()" class="fullMessage" ></div>
      </b-container>
    </b-container>
  </b-modal>
</template>
<script>
import config from "../../config/config.json";
import axios from "axios";

export default {
  props: {
    message: { required: false },
    priority: { type: String, required: false, default: "info" }
  },
  data() {
    return {
      listURL: []
    };
  },
  methods: {
    closeMsg(e) {
      this.$emit("onmenu");
      e.preventDefault();
    },
    showModal() {
      this.$refs.modalDetailMessage.show();
    },
    formatedMessage() {
      return getValuesAsString(this.message.message);
    },
    showURL() {
      return this.listURL.length > 0;
    }
  },
  watch: {
    message: function(newVal, oldVal) {
      //récupération de l'url fournit dans le message.

      this.listURL = [];
      if (newVal.filter != undefined && newVal.filter.url != undefined) {
        this.listURL.push(newVal.filter.url);
      }
      if (config.addressSearch != undefined) {
        config.addressSearch.forEach(item => {
          //si la source confluence est configurée :
          if (item.url != undefined && item.search != undefined && newVal.origine != "") {
            const surl = item.url + getRequest(item.search, newVal.origine);

            console.log(surl);
            //get sur l'api rest de confluence
            axios
              .get(surl)
              .then(res => {
                if (
                  res != undefined &&
                  res.data != undefined &&
                  res.status == 200
                ) {
                  const ret = res.data;

                  if (ret.size > 0) {
                    const urls = ret.results;
                    //construction des urls à partir de la réponse
                    urls.forEach(ligne => {
                      this.listURL.push(ret._links.base + ligne._links.webui);
                    });
                  }
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
      }
    }
  }
};

const getRequest = (search, val) => {
  let listWord = val.replace(/[^A-z]/g, " ").split(" ");
  listWord = listWord.filter(w => w != "");
  
  if (listWord.length > 0) {
    const listURL = listWord.map(w =>
      search.replace(/{searchText}/g, w)
    );

    return listURL.join("%20or%20");
  }else return null;

  
};

const getValuesAsString = obj => {
  try {
    //If type = string, try to parse
    if (typeof obj == "string") {
      obj = JSON.parse(obj);
    }
  } catch (e) {
    //nothing to do, just not JSON
  }
  let retour = "";
  //if string, no need
  if (typeof obj == "string") return obj;

  const values = Object.values(obj);
  //parcourt les clés
  Object.keys(obj).forEach((key, pos) => {
    //adding the header
    retour +=
      "<span style='font-weight:bold;text-decoration:underlined;'>" +
      key +
      " : </span>";
    retour += "<br/>";
    let val = values[pos];

    retour +=
      "<span style='margin-left:5px;'>" +
      (typeof val == "object" ? getValuesAsString(val) : val) +
      "</span>";
    retour += "<br/>";
  });
  retour += "<br/>";
  return retour;
};
</script>
<style>
.detail,
.fullMessage,
.stackMessage {
  position: relative;
}
.overMessage {
  position: fixed;
  z-index: 5;
  width: 55%;
  height: 75%;
  left: 25%;
  background-color: #e6e6e6;
  color: #404040;
  padding-left: 1%;
  padding-right: 1%;
  padding-top: 1%;
  top: 3%;
  border: 1px solid grey;
  border-radius: 0.5rem;
}

.hMessage {
  border-style: solid;
  border-color: #737373;
  border-width: 3px;
  padding-left: 3px;
  padding-right: 3px;
  margin-bottom: 1%;
  width: 98%;
}

.fullMessage,
.stackMessage {
  overflow: auto;
}

.fullMessage {
  max-height: 40%;
}
.stackMessage {
  max-height: 40%;
}
#divURLs ul {
  padding-left: 45px;
}
</style>
