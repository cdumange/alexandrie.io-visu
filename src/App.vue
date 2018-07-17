<template>
  <b-container fluid>
  <b-row id="divGenerale" >
    <messageDetail ref="detailMessage" :message="selectedMessage" v-bind:priority="getTypeMessage(selectedMessage)" @onmenu="closeMsg"></messageDetail>
    <b-col id="listType" cols="1">
      <b-nav pills vertical>
          <typeMessage
            v-for="chan in listChan"
            @onclick="changeTypeSelection"
            :key="chan.typeMessage"
            :selectedType="filtre.selectedType"
            :typeMessage="chan"
          >
          </typeMessage>
      </b-nav>
    </b-col>
    <b-col id="listOrigine" v-bind:class="showDivs() ? '' : ' hidden '" cols="2">
      <b-nav pills vertical>
        <OrigineMessage
          v-for="org in listOrigine"
          :key="org" :libelle="org"
          :value="org"
          :selectedOrigine="filtre.selectedOrigine"
          v-bind:maxPriority="getMaxPrio(org)"
          @onclick="changeOrigineSelected"/>
      </b-nav>
    </b-col>
    <b-col id="listMess" v-bind:class="showDivs() ? '' : ' hidden '" cols="8">
      <filtreCHCN
        :dateDebut="filtre.dateDebut"
        :dateFin="filtre.dateFin"
        :selectedPriority="filtre.importance"
        :mapPrio="mapPrio"
        :searchField="filtre.searchText"
        @onclick="changedSearch"
      >
      </filtreCHCN>
      <b-container class="divMessage">
      <paginate name="vlistMessage" :list="listMessage" :per="6">
        <message
          v-for="mess in paginated('vlistMessage')"
          @onclick="changeMessageSelected"
          :key="mess._id "
          :message="mess"
          v-bind:priority="getTypeMessage(mess)">
        </message>
      </paginate>
      <p style="display:inline;max-width:20px;"> pages : </p>
      <nav >
        <paginate-links class="footerP pagination" for="vlistMessage"     
          :limit=15
          :show-step-links="true"
          :step-links="{
            prev: 'Back',
            next: 'Next'
          }"
          :classes="{
            'li': 'page-item',
            'li > a': 'page-link'
          }"
        />
      </nav>
      </b-container>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
const defaultOrigine = "All";
const DEFAULT_PRIORITY = 'info';
const formatData = data => {
  if (typeof data === "string") data = JSON.parse(data);

  try {
    if (typeof data.message === "string") {
      data.message = JSON.parse(data.message);
    }
  } catch (e) {}
  return data;
};

const yesterday = () => {
  const searchDate = new Date();
  searchDate.setUTCHours(searchDate.getUTCHours() - 24);
  return new Date(
    searchDate.getFullYear(),
    searchDate.getMonth(),
    searchDate.getDate()
  );
};

const prioMappeur = new Map();
prioMappeur.set("danger", ["fatal", "error", "Error", "ERROR"]);
prioMappeur.set("warning", ["warning", "warn", "Warn", "WARN"]);
prioMappeur.set("info", ["1", "information", "info", "Info", "INFO", 1]);
prioMappeur.set("success", ["ok", "success", "1"]);

const addToMap = (map, message) => {
  if (message.priority == undefined) return null;

  const prio = message.priority.toString().toLowerCase();
  //determining prio
  const key = getTypeFromPrio(prio);

  let tab = null;
  if (map.get(key) != undefined) {
    //if already exists, get existing tab
    tab = map.get(key);
  } else {
    //else creating a new one
    tab = [];
  }
  //adding the item
  tab.push(message);
  //setting the map
  map.set(key, tab);
  return map;
};

const getTypeFromPrio = function(prio) {
  let retour = "info";
  const iter = prioMappeur.keys();
  let key = null;
  do {
    key = iter.next().value;
    if (key != undefined) {
      if (prioMappeur.get(key).indexOf(prio) >= 0) {
        retour = key;
        break;
      }
    }
  } while (key != undefined);
  return retour;
};

export default {
  name: "app",
  data() {
    return {
      selectedMessage: null,
      listMessage: [],
      listOrigine: [],
      mapPrio: null,
      defined: false,
      paginate: ["vlistMessage"],
      filtre: {
        selectedType: "",
        selectedOrigine: defaultOrigine,
        selectedPriority: "",
        dateDebut: yesterday(),
        dateFin: null,
        importance: "",
        searchText: ""
      }
    };
  },
  props: {
    listChan: {
      type: Array,
      required: true
    },
    socket: {
      type: Object,
      required: true
    }
  },
  watch: {},
  mounted: function() {
    this.socket.on("resCache", (data, headers) => {
      data = formatData(data);

      this.listMessage = [];
      this.listOrigine = [];
      this.listPriority = [];

      if (this.mapPrio != undefined) {
        this.mapPrio.clear();
      }
      this.mapPrio = new Map();

      this.listOrigine.push("All");

      for (let n = 0; n < data.length; n++) {
        this.addMessage(data[n]);
      }

      //bypass pour le bug de la pagination si liste vide
      if (this.listMessage.length == 0) {
        const emptyMessage = {
          origine: "Alexandrie.io-server",
          priority: "success",
          message: "Cette liste/recherche est vide.",
          date : new Date()
        };

        this.listMessage.push(emptyMessage);
      }
    });

    this.socket.on("msg", (data, headers) => {
      data = formatData(data);

      if (data.typeMessage === this.selectedType) {
        this.addMessage(data);
      }
    });
  },
  methods: {
    showDivs: function() {
      return (
        this.filtre.selectedType != undefined && this.filtre.selectedType != ""
      );
    },
    changeTypeSelection: function(type) {
      if (this.filtre.selectedType != type) {
        this.filtre.selectedType = type;
        this.filtre.selectedOrigine = defaultOrigine;
        this.filtre.selectedPriority = "";
      }
      this.updateFilter();
    },
    updateFilter: function() {
      var f = {
        typeMessage: this.filtre.selectedType
      };

      if (this.filtre.selectedOrigine != defaultOrigine) {
        f.origine = this.filtre.selectedOrigine;
      }

      if (this.filtre.selectedPriority != "") {
        const vals = prioMappeur.get(this.filtre.selectedPriority);
        f.priority = { $in: vals };
      }

      if (this.filtre.dateDebut != undefined && this.filtre.dateDebut != "") {
        f.dateD = this.filtre.dateDebut;
      } else {
        f.dateD = yesterday();
      }

      if (this.filtre.dateFin != undefined && this.filtre.dateFin != "") {
        f.dateF = this.filtre.dateFin;
      }

      console.log(JSON.stringify(f));

      this.socket.emit("requestcache", f);
    },
    addMessage: function(data) {
      data = formatData(data);

      //Rémplissage de la liste des origines

      if (
        data.origine !== undefined &&
        data.origine !== "" &&
        this.listOrigine.indexOf(data.origine) < 0
      ) {
        this.listOrigine.push(data.origine);
      }

      if (this.filtre.searchText != undefined && this.filtre.searchText != "") {
        const text = JSON.stringify(data.message).toLowerCase();

        if (text.indexOf(this.filtre.searchText.toLowerCase()) >= 0) {
          this.listMessage.push(data);
          addToMap(this.mapPrio, data);
        }
      } else {
        this.listMessage.push(data);
        addToMap(this.mapPrio, data);
      }
    },
    changeMessageSelected: function(mess) {
      this.selectedMessage = mess;
      this.$refs.detailMessage.showModal();
      //this.$refs.detailMessage.priority = getTypeFromPrio(mess.priority);
    },
    changeOrigineSelected: function(origine) {
      this.filtre.selectedOrigine = origine;
      this.updateFilter();
    },
    closeMsg: function() {
      this.selectedMessage = null;
    },
    changedSearch: function(val) {
      if (val.searchText != undefined) this.filtre.searchText = val.searchText;
      else this.filtre.searchText = "";

      if (val.dateD != undefined) this.filtre.dateDebut = val.dateD;

      if (val.dateF != undefined) this.filtre.dateFin = val.dateF;
      else delete this.filtre.dateFin;
      if (val.selectedPriority != undefined) {
        if (this.filtre.selectedPriority == val.selectedPriority) {
          this.filtre.selectedPriority = "";
        } else {
          this.filtre.selectedPriority = val.selectedPriority;
        }
      }

      this.updateFilter();
    },

    getMaxPrio: function(origine) {
      const map = this.getMapLvlForPred(function(e) {
        return (
          (e.message.origine != undefined ? e.message.origine : e.origine) ==
            origine || origine == "All"
        );
      });

      let prio = "info";
      const iter = map.keys();

      let priority = null;
      do {
        priority = iter.next().value;

        if (priority == "danger") return priority;
        if (priority == "warning") prio = priority;
      } while (priority != undefined);

      return prio;
    },
    getMapLvlForPred: function(predicament) {
      let mapRetour = new Map();
      const list = this.listMessage.filter(predicament);
      if (list.length > 0) {
        list.forEach(item => {
          addToMap(mapRetour, item);
        });
      }
      return mapRetour;
    },
    getTypeMessage : function (mess){
      if (mess == undefined) return DEFAULT_PRIORITY;
      return getTypeFromPrio(mess.priority);
    }
  }
};
</script>

<style lang="css">
body,
#divGenerale,
.typeMessage {
  background-color: #8c8c8c;
  color: #404040;
}

.typeMessage:hover,
.message:hover {
  background-color: #4d4d4d;
  color: #cccccc;
}

.header {
  max-height: 150px;
  position: static;
  font-size: 24px;
  font-weight: bolder;
}
.pHeader {
  padding-left: 30px;
  margin: 0px;
}

#divGenerale {
  margin-top: 2.5%;
}

#listType,
#listOrigine {
  border-right: 2px solid grey;
}

#listType,
#listMess {
  color: #cccccc;
}

.pHeader {
  background-color: #000;
  color: #cccccc;
}

.pointer {
  cursor: pointer;
}

.footerP {
  left: 20px;
}

.hidden {
  display: none !important;
}

ul,
.divMessage {
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}
</style>
