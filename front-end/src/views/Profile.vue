<template>
<div>
    <div>
        <div v-if="profile">
          <button @click="changeProfile()">Change Profile</button>
        </div>
        <input class="suggestions input" v-else v-model="user" placeholder="Profile Name" @focus="focus=true">
        <div class="suggestions" v-if="focus">
            <div class="suggestion" v-for="s in suggestionsUser" :key="s._id" @click="selectUser(s)">{{s.name}}</div>
            <div class="suggestion" v-if="user.length > 0" @click="createNewUser(user)">Create "{{this.user}}"</div>
        </div>
    </div>
    <div v-if="profile">
        <div class="heading">
          <div class="profile-info" v-if="editMode">
            <div class="row">
              <p>Name: <input v-model="edit.name"></p>
              <p>Location: <input v-model="edit.location"></p>
            </div>
            <div>
              <button @click="editToggle()">Cancel</button>
              <button @click="editProfile()">Confirm Changes</button>
              <button @click="deleteProfile()">Delete</button>
            </div>
          </div>
          <div class="profile-info" v-else>
            <div class="row">
              <p>Current profile: {{profile.name}}</p>
              <p>Location: {{profile.location}}</p>
            </div>
            <button @click="editToggle()">Profile Options</button>
          </div>
        </div>
        <p></p>
        <div class="row">
          <div class="add">
          <h2>Add an Item</h2>
            <div class="form">
                <input v-model="item.name" placeholder="Name">
                <p></p>
                <textarea v-model="item.discription" placeholder="Discription"></textarea>
                <p></p>
                <input v-model="item.price" placeholder="Price (e.g. $5/day)">
                <p></p>
                <label class="button file">
                <input type="file" name="photo" @change="fileChanged">
                <p>Photo</p>
                </label>
                <p></p>
                <div class="horizonal-break"></div>
                <p></p>
                <button @click="upload">Upload</button>
            </div>
            <div class="upload" v-if="addItem">
                <p>{{addItem.name}} successfully added!</p>
            </div>
          </div>
          <div class="edit">
            <h2>Edit or Delete an Item</h2>
            <div>
                <input class="suggestions input" v-model="findTitle" placeholder="Search">
                <div class="suggestions" v-if="suggestionsItem.length > 0">
                  <div class="suggestion" v-for="s in suggestionsItem" :key="s.id" @click="selectItem(s)">{{s.name}}
                  </div>
                </div>
            </div>
            <div class="upload row" v-if="findItem">
                <img :src="findItem.path" />
                <div class="edit-right">
                  <input v-model="findItem.name">
                  <p></p>
                  <input v-model="findItem.price" placeholder="Price">
                  <p></p>
                  <textarea v-model="findItem.discription"></textarea>
                </div>
            </div>
            <div class="actions" v-if="findItem">
                <button @click="deleteItem(findItem)">Delete</button>
                <button @click="editItem(findItem)">Edit</button>
            </div>
          </div>
        </div>
    </div>
    <div v-else>
        <h2>Choose a profile</h2>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Profile',
  data() {
    return {
        //for finding user
        users: [],
        user: "",
        focus: false,
        //for profile editing
        editMode: false,
        edit: {},
        profile: null,
        //for adding new items
        item: {},
        addItem: null,
        //for item search
        items: [],
        findTitle: "",
        findItem: null,
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
    //methods for profile functionality
    async getUsers() {
      try {
        let response = await axios.get("/api/profile");
            this.users = response.data;
            return true;
        } catch (error) {
          console.log(error);
        }
    },
    selectUser(item) {
        this.user = "";
        this.focus = false;
        this.profile = item;
        this.getItems();
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
    changeProfile() {
      this.profile = null;
      this.addItem = null;
      this.findItem = null;
    },
    //Profile option buttons
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
        for(let i = 0; i < this.items.length; i++) {
          await axios.delete("/api/profiles/" + this.profile._id + "/items/" + this.items[i]._id);
        }
        await axios.delete("/api/profile/" + this.profile._id);
        for(let i = 0; i < this.users.length; i++) {
          if(this.users[i]._id == this.profile._id) {
            this.users.splice(i,1);
            break;
          }
        }
        this.profile = null;
        this.items = [];
        this.editMode = false;
      } catch (error) {
        console.log(error);
      }
    },

    //Item functionality
    //Facilites adding photos to item
    fileChanged(event) {
      this.item.file = event.target.files[0]
    },
    //Add item
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.item.file, this.item.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/profiles/' + this.profile._id + '/items', {
          name: this.item.name,
          path: r1.data.path,
          price: this.item.price,
          discription: this.item.discription
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
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async editItem(item) {
      try {
        await axios.put("/api/profiles/" + this.profile._id + "/items/" + item._id, {
          name: this.findItem.name,
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
    async deleteItem(item) {
      try {
        await axios.delete("/api/profiles/" + this.profile._id + "/items/" + item._id);
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
.row {
  align-items: flex-start;
}

.file {
  display: inline-block;
  padding: 6px 12px;
  text-align: center;
  padding: 0;
}

.file p {
  padding: 0;
  width: 190px;
  height: 20px;
  padding: auto;
}

.button,
button {
  height: 20px;
  margin: 5px;
  padding-left: 5px;
  padding-right: 5px;
  background: var(--main);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  border: none;
  font: 400 13.3333px Arial;
}

img {
  max-width: 40%;
}

input[type=file] {
  display: none;
}

p, h2{
  padding: 10px;
}

.add, .edit {
  width: 50%;
}

.form * {
  width: 200px;
}

.input {
  padding: 1px 2px;
}

.suggestions {
  width: 200px;
  border: 1px solid #ccc;
  margin: 0 auto;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: var(--neutral);
}

.profile-info {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--neutral);
}

.upload {
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 5px;
}

.edit-right {
  margin-top: 10px;
}
</style>