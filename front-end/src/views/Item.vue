<template>
  <div class="item">
    <h1>{{item.name}}</h1>
    <img :src="item.path" />
    <p>{{item.price}}</p>
    <p>{{item.discription}}</p>
    <p>{{owner.name}}</p>
    <p>{{owner.location}}</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      item: {},
      owner: {}
    }
  },
  created() {
    this.getItem();
  },
  methods: {
    async getItem() {
      try {
        let itemResponse = await axios.get("/api/items/" + this.$route.params.id);
        this.item = itemResponse.data;
        let ownerResponse = await axios.get("/api/profile/" + itemResponse.data.owner);
        this.owner = ownerResponse.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getOwner() {
      try {
        let response = await axios.get("/api/profile/" + this.item.owner);
        this.item.owner = response.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
