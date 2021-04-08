<template>
  <div class="home">
    <h1>Catalog</h1>
    <div class="horizonal-break" style="border-bottom: var(--main) solid 2px;"></div>
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
h1 {
  padding: .5em 0;
}

.grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 1em 2em;
    width: 90%;
}

.item {
  width: 15em;
  height: 22.5em;
  border: var(--grey) solid 1px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.item p, h2{
  padding: .4em 0;
}

img {
  max-width: 90%;
  max-height: 17.8em;
}

a {
  text-decoration: none;
  color: var(--var);
}
</style>