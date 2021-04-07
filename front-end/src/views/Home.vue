<template>
  <div class="home">
    <h1>Catalog</h1>
    <div class="grid">
      <router-link class="item" v-for="item in items" :key="item.id" :to="'/item/' + item._id">
        <h2>{{item.name}}</h2>
        <img :src="item.path" />
        <p>{{item.price}}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
     items: [],
    }
  },
  created() {
    this.getItems();
  },
  methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>
.grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 2em;
    width: 90%;
}

.item {
  width: 255px;
  border: grey solid 1px;
  margin: 10px;
}

img {
  max-width: 90%;
}
</style>