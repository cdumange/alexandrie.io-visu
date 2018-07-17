<template>
  <b-container id="divFiltre" class="filterDiv pHeader">
    <b-row>
      <b-col cols="3" class="zoneDate">
          <b-container>
            <input v-model="searching" class="Input" v-on:keyup="checkKey" placeholder="..."/>
          </b-container>
      </b-col>
      <b-col cols="3" class="dateDiv">
          From : <input v-model="dateD" class="Input" type="date"/>
      </b-col>
      <b-col cols="3" class="dateDiv">
         To : <input v-model="dateF" class="Input" type="date"/>
      </b-col>
      <b-col style="vertical-align:middle" cols = "3">
        <b-container :id="item.key" 
        v-for="item in Array.from(listPrio)" 
        v-bind:key="item.key" 
        v-on:click="selectPrio(item.key)"
        class="pointer lvlPrio alert"
        v-bind:class="'alert-' + item.key" >{{item.value}}</b-container>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
function fromDate(date) {
  //retour date HTML5
  return (
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2)
  );
}

function toDate(strDate) {
  const tab = strDate.split("-");
  return new Date(tab[0], tab[1] - 1, tab[2]);
}

export default {
  name: "filtre",
  props: {
    dateDebut: { type: Date, required: true},
    dateFin: { type: Date, required: false, default: null },
    selectedPriority: { type: String, required: false, default: "" },
    mapPrio: { type: Map, required: false }
  },
  data() {
    return {
      listPrio: [],
      searching: "",
      dateD: fromDate(this.dateDebut),
      dateF: ""
    };
  },
  watch: {
    mapPrio: function(newVal, oldVal) {
      this.listPrio = [];
      newVal.forEach((value, key, map) => {
        this.listPrio.push({
          key: key,
          value: value.length
        });
      });
    },
    dateDebut: function(newVal, oldVal) {
      this.dateD = fromDate(newVal);
    },
    dateFin: function(newVal, oldVal) {
      this.dateF = fromDate(newVal);
    }
  },
  methods: {
    checkKey(ev) {
      if (ev.keyCode == 13) {
        this.buildFilter();
      }
    },
    buildFilter(prio = null) {
      let filter = {};

        if (this.searching != "") filter.searchText = this.searching;
        filter.dateD = toDate(this.dateD);
        if (this.dateF != undefined && this.dateF != "") filter.dateF = toDate(this.dateF);
        if (prio != undefined)filter.selectedPriority = prio;
        this.$emit("onclick", filter);
    },
    selectPrio(prio){
      this.buildFilter(prio);
    }
  },

};
</script>
<style>
.zoneDate {
  display: inline;
  position: static;
}

.filterDiv {
  max-height: 150px;
}
.lvlPrio,
.dateDiv {
  font-weight: bolder;
  font-size: 16px;
  text-align: center;
}
.lvlPrio {
  display: inline-block;
  max-width: 50px;

  margin-left: 8px;

  padding: 0 0 0 0;
  float: right;
}

.dateDiv {
  padding-top: 10px !important;
}

.Input {
  height: 30px;
}

#divFiltre div {
  padding-top: 5px;
  padding-bottom: 5px;
  max-height: 55px;
  min-height: 35px;
}
</style>
