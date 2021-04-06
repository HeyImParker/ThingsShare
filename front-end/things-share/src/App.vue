<template>
  <div id="app">
    <div class="header">
      <div class="title">
        <h1>Things Share</h1>
      </div>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/profile">Profile</router-link>
        <router-link to="/areaFilter">Filter by Area<router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header {
  padding: 10px;
  background: rgb(201, 201, 201);
  display: flex;
  justify-content: space-between;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
