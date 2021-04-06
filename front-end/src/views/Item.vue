<template>
  <div class="item">
    
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      item: {},
    }
  },
  created() {
    this.getItem();
    console.log(this.item);
  },
  method: {
    async getItem() {
      try {
        let response = await axios.get("/api/items/" + this.$route.params.id);
        this.item = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>
