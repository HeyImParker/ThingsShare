<template>
  <div class="home">
    <h1>Catalog</h1>
    <router-link v-for="item in items" :key="item.id" :to="'/item/' + item._id">
      <h2>{{item.name}}</h2>
      <img :src="item.path" />
      <p>{{item.price}}</p>
    </router-link>
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
