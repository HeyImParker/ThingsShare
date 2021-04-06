<template>
  <div class="home">
    <div v-for="item in items" :key="item.id">
      <h2>{{item.title}}</h2>
      <img :src="item.path" />
      <p>{{item.discription}}</p>
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
