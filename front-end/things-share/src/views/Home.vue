<template>
  <div class="home">
    <div class="item" v-for="item in items" :to="'/item/' + item.id" :key="item._id">
      <h2>{{item.name}}</h2>
      <img :src="item.path" />
      <p>${{item.cost}}</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
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
    }
  },
}
</script>
