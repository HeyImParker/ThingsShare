<template>
<div class="admin">
    <h1>The Admin Page!</h1>
    <div class="form">
        <input v-model="user" placeholder="Username" @focus="focus=true">
        <div class="suggestions" v-if="focus">
            <div class="suggestion" v-for="s in suggestionsUser" :key="s._id" @click="selectUser(s)">{{s.name}}</div>
            <div class="suggestion" @click="createNewUser(user)">Create "{{this.user}}"</div>
        </div>
    </div>
    <div v-if="profile">
        <div class="heading">
          <div class="user-info" v-if="editMode">
            <p>Name: <input v-model="edit.name"></p>
            <p>Location: <input v-model="edit.location"></p>
            <button @click="editToggle()">Cancel</button>
            <button @click="editProfile()">Confirm</button>
            <button @click="deleteProfile()">Delete</button>
          </div>
          <div v-else>
            <p>Current profile: {{profile.name}}</p>
            <p>Location: {{profile.location}}</p>
            <button @click="editToggle()">Profile Options</button>
          </div>
          <h2>Add an Item</h2>
        </div>
        <div class="add">
        <div class="form">
            <input v-model="name" placeholder="Name">
            <p></p>
            <textarea v-model="discription" placeholder="Discription"></textarea>
            <p></p>
            <input v-model="price" placeholder="Price">
            <p></p>
            <input type="file" name="photo" @change="fileChanged">
            <button @click="upload">Upload</button>
        </div>
        <div class="upload" v-if="addItem">
            <h2>{{addItem.title}}</h2>
            <img :src="addItem.path" />
        </div>
        </div>
        <div class="heading">
        <div class="circle">2</div>
        <h2>Edit or Delete an Item</h2>
        </div>
        <div class="edit">
        <div class="form">
            <input v-model="findTitle" placeholder="Search">
            <div class="suggestions" v-if="suggestionsItem.length > 0">
            <div class="suggestion" v-for="s in suggestionsItem" :key="s.id" @click="selectItem(s)">{{s.title}}
            </div>
            </div>
        </div>
        <div class="upload" v-if="findItem">
            <input v-model="findItem.title">
            <p></p>
            <textarea v-model="findItem.discription"></textarea>
            <p></p>
            <input v-model="findItem.price" placeholder="Price (e.g. $5/day)">
            <p></p>
            <img :src="findItem.path" />
        </div>
        <div class="actions" v-if="findItem">
            <button @click="deleteItem(findItem)">Delete</button>
            <button @click="editItem(findItem)">Edit</button>
        </div>
        </div>
    </div>
    <div v-else>
        <h3>Choose a user</h3>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Profile',
  data() {
    return {
        users: [],
        user: "",
        profile: null,
        name: "",
        discription: "",
        price: null,
        file: null,
        addItem: null,
        items: [],
        findTitle: "",
        findItem: null,
        focus: false,
        editMode: false,
        edit: {}
    }
  },
  computed: {
    suggestionsItem() {
      let items = this.items.filter(item => item.name.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return items.sort((a, b) => a.name > b.name);
    },
    suggestionsUser() {
      let users = this.users.filter(user => user.name.toLowerCase().startsWith(this.user.toLowerCase()));
      return users.sort((a, b) => a.name > b.name);
    },
  },
  created() {
      this.getUsers();
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    editToggle() {
      this.edit.name = this.profile.name;
      this.edit.location = this.profile.location;
      this.editMode = !(this.editMode);
    },
    async editProfile() {
      try {
        await axios.put("/api/profile/" + this.profile._id, {
          name: this.edit.name,
          location: this.edit.location,
        });
        this.profile.name = this.edit.name;
        this.profile.location = this.edit.location;
        this.editMode = !(this.editMode);
      } catch (error) {
        console.log(error);
      }
    },
    async deleteProfile() {
      try {
        await axios.delete("/api/profile/" + this.profile._id);
        for(let i = 1; i < this.users.length; i++) {
          if(this.users[i]._id == this.profile._id) {
            this.users.splice(i,1);
          }
        }
        this.profile = null;
        this.editMode = false;
      } catch (error) {
        console.log(error);
      }
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let api = '/api/profiles/' + this.profile._id + '/items';
        console.log(api);
        let r2 = await axios.post(api, {
          name: this.name,
          path: r1.data.path,
          price: this.price,
          discription: this.discription
        });
        this.addItem = r2.data;
        this.items.push(r2.data);
      } catch (error) {
        console.log(error);
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/profiles/" + this.profile._id + "/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getUsers() {
        try {
            let response = await axios.get("/api/profile");
            this.users = response.data;
            return true;
        } catch (error) {
            console.log(error);
        }
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async selectUser(item) {
        this.user = "";
        this.focus = false;
        this.profile = item;
        try {
            let response = await axios.get("/api/profiles/" + this.profile._id + "/items");
            this.items = response.data;
            return true;
        } catch (error) {
            console.log(error);
        }
    },
    async createNewUser(name) {
        try {
            let newProfile = await axios.post('/api/profile', {
                name: name
            });
            this.selectUser(newProfile.data);
            this.users.push(newProfile.data);
        } catch(error) {
            console.log(error);
        }
    },
    async deleteItem(item) {
      try {
        await axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editItem(item) {
      try {
        await axios.put("/api/items/" + item._id, {
          title: this.findItem.title,
          discription: this.findItem.discription,
          price: this.findItem.price
        });
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
}
</script>

<style scoped>
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
}
</style>