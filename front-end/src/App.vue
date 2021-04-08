<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/profile">Profile</router-link>
    </div>
    <router-view/>
    <div class="footer">
        <p>https://github.com/HeyImParker/ThingsShare</p>
  </div>
  </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* color scheme */
:root {
  --main: #05A8AA;
  --neutral: #ecd7af;
  --grey: #505d69;
}

.row {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.horizonal-break {
  width: 90%;
  margin: 0 auto;
  border-bottom: var(--neutral) solid 2px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 20px;
}

#nav a {
  font-weight: bold;
  color: var(--grey);
}

#nav a.router-link-exact-active {
  color: var(--main);
}

.footer {
  display: flex;
  justify-content: center;
}
</style>
