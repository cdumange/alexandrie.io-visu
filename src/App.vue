<template>
  <b-container fluid>
  <b-row id="divGenerale" v-model="listMessage">
    <messageDetail ref="detailMessage" :message="selectedMessage" @onmenu="closeMsg"></messageDetail>
    <b-col id="listType" cols="1">
      <b-nav pills vertical>
          <typeMessage
            v-for="chan in listChan"
            @onclick="changeTypeSelected"
            :key="chan.typeMessage"
            :selectedType="filtre.selectedType"
            :typeMessage="chan"
            :selectedPriority="filtre.selectedPriority">
          </typeMessage>
      </b-nav>
    </b-col>
    <b-col id="listOrigine" cols="1">
      <b-nav pills vertical>
        <OrigineMessage
          v-for="org in listOrigine"
          :key="org" :libelle="org"
          :value="org"
          :selectedOrigine="filtre.selectedOrigine"
          @onclick="changeOrigineSelected"/>
      </b-nav>
    </b-col>
    <b-col id="listMess" cols="9">
      <filtre
        :dateDebut="filtre.dateDebut"
        :dateFin="filtre.dateFin"
        :selectedPriority="filtre.importance"
        :listPrio="listPriority" >
      </filtre>
      <paginate name="vlistMessage" :list="listMessage" :per="6">
        <message
          v-for="mess in paginated('vlistMessage')"
          @onclick="changeMessageSelected"
          :key="mess._id "
          :message="mess">
        </message>
      </paginate>
      <p style="display:inline;max-width:20px;"> pages : </p>
      <nav>
        <paginate-links class="footerP pagination" for="vlistMessage"
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
    </b-col>
  </b-row>
</b-container>
</template>

<script>
  var defaultOrigine = 'All';
  const formatData = (data) => {
    if (typeof data === 'string')
      data = JSON.parse(data);

    try{
      if (typeof data.message === 'string'){
        data.message = JSON.parse(data.message);
      }
    }catch(e){

    }
    return data;
  }
  export default {
    name: 'app',
    data (){
      return {
        selectedMessage : null,
        listMessage : [],
        listOrigine : [],
        listPriority : [],
        defined : false,
        paginate : ['vlistMessage'],
        filtre : {
          selectedType : '',
          selectedOrigine : defaultOrigine,
          selectedPriority: "",
          dateDebut : new Date(),
          dateFin : null,
          importance : ""
        }
      }
    },
    props : {
      listChan : {
        type : Array, required : true
      },
      socket : {
        type: Object, required : true
      }
    },
    mounted : function () {
      this.socket.on('resCache', (data, headers) => {
        data = formatData(data);

        this.listMessage = [];
        this.listOrigine = [];
        this.listPriority = [];
        this.listOrigine.push("All");


        for (let n=0;n<data.length;n++){
          this.addMessage(data[n]);
        }
      });

      this.socket.on('msg', (data, headers) => {
        data = formatData(data);

        if(data.typeMessage === this.selectedType){
          this.addMessage(data);
        }
      });
    },
    methods : {
      changeTypeSelected : function (type){
        if(this.filtre.selectedType != type){
          this.filtre.selectedType = type;
          this.filtre.selectedOrigine = defaultOrigine;
        }

        var f = {
          "typeMessage" : this.filtre.selectedType
        }

        if(this.filtre.selectedOrigine != defaultOrigine){
          f.origine= this.filtre.selectedOrigine;
        }

        if (this.filtre.selectedPriority != ""){
          f.priority = this.filtre.selectedPriority;
        }

        console.log("filtre :");
        console.log(JSON.stringify(f));

        this.socket.emit('requestcache',f);
      },
      addMessage : function (data){
        data  = formatData(data);

        //Rémplissage de la liste des origines
        if (data.message.origine != undefined && this.listOrigine.indexOf(data.message.origine) < 0){
          this.listOrigine.push(data.message.origine);
        }

        //Remplissage de la liste des priorités seulement si source sélectionner
        if (data.priority != undefined && this.listPriority.indexOf(data.priority) < 0){
          this.listPriority.push(data.priority);
        }

        this.listMessage.push(data);
      },
      changeMessageSelected : function(mess){
        this.selectedMessage = mess;
        this.$refs.detailMessage.showModal();
      },
      changeOrigineSelected : function(origine){
        this.filtre.selectedOrigine = origine;
        this.changeTypeSelected(this.filtre.selectedType);
      },
      closeMsg : function(){
        this.selectedMessage = null;
      }
    }
  }


</script>

<style lang="css">
  body, #divGenerale,.typeMessage{
    background-color: #8c8c8c;
    color:#404040;
  }

  .typeMessage:hover, .message:hover{
    background-color: #4d4d4d;
    color: #cccccc;
  }


  .header{
    max-height: 150px;
    position: static;
    font-size: 24px;
    font-weight: bolder;
  }
  .pHeader{
    padding-left: 30px;
    margin: 0px;
  }

  #divGenerale {
    margin-top: 2.5%;
  }

  #listType, #listOrigine{
    border-right: 2px solid grey;
  }

  #listType, #listMess{
    background-color: #00;
    color:#cccccc;
  }

  .pHeader{
    background-color: #000;
    color:#cccccc;
  }

  .pointer {
    cursor:pointer;
  }

  .footerP{
    left : 20px;
  }
</style>
