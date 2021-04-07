<template>
  <div class="row item">
    <img :src="item.path" />
    <div class="left-side">
      <h1>{{item.name}}</h1>
      <p class="owner">{{owner.name}} -- {{owner.location}}</p>
      <h3>{{item.price}}</h3>
      <p style="padding-top:20px">{{item.discription}}</p>
    </div>
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

<style scoped>
.item {
  width: 85%;
  margin: 0 auto;
  align-items: flex-start;
}

.left-side {
  width: 50%;
}

.left-side * {
  text-align: left;
  padding: 5px 15px;
}

img {
  max-width: 50%;
}

h1 {
  margin-top: 10px;
  font-size: 2.5em;
}

h3 {
  font-size: 1.5em;
}

.owner {
  color: rgb(117, 117, 117);
  font-style: italic;
  font-size: .9em;
}
</style>