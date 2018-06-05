<template>
  <b-modal ref="modalDetailMessage"
            size="lg"
             ok-only
             header-bg-variant="dark"
             header-text-variant="light"
              title="Détail du message">
      <div v-if="message != null">
        <message class="hMessage" :message="message"></message>
        <b-row class="detail">
          <div v-html="formatedMessage()" class="fullMessage" ></div>
          <div v-html="message.message.stackMessage" class="stackMessage"></div>
        </b-row>
      </div>
    </div>
    </b-modal>
</template>
<script>
  export default{
    props : {
      message : {required :false}
    },
    methods : {
      closeMsg(e) {
        this.$emit('onmenu');
        e.preventDefault();
      },
      showModal(){
        this.$refs.modalDetailMessage.show();
      },
      formatedMessage (){
        if(this.message.message.message != undefined)
          return this.message.message.message;
        else {
          return this.message.message;
        }
      }
    }
  }
</script>
<style>
  .detail, .fullMessage, .stackMessage{
    position:relative;
  }
  .overMessage{
    position: fixed;
    z-index: 5;
    width:55%;
    height: 75%;
    left:25%;
    background-color: #e6e6e6;
    color:#404040;
    padding-left: 1%;
    padding-right: 1%;
    padding-top: 1%;
    top:3%;
    border: 1px solid grey;
    border-radius: 0.50rem;
  }

  .hMessage{
    border-style: solid;
    border-color: #737373;
    border-width: 3px;
    padding-left: 3px;
    padding-right: 3px;
    margin-bottom: 1%;
    width:98%;

  }

  .fullMessage, .stackMessage{
    overflow: auto;
  }

  .fullMessage{
    max-height: 40%;
  }
  .stackMessage{
    max-height: 40%;
  }
</style>
