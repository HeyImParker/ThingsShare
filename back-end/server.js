const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

// connect to the database
mongoose.connect('mongodb://localhost:27017/thing-share', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a scheme for profiles
const profileSchema = new mongoose.Schema({
    name: String,
    location: String
});
  
  // Create a model for profiles
const Profile = mongoose.model('Profile', profileSchema);

const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
    // Just a safety check
    if (!req.file) {
      return res.sendStatus(400);
    }
    res.send({
      path: "/images/" + req.file.filename
    });
  });

// Create a profile
app.post('/api/profile', async (req, res) => {
    const profile = new Profile({
      name: req.body.name,
      color: req.body.location
    });
    try {
      await profile.save();
      res.send(profile);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

// Get a list of all profiles
app.get('/api/profile', async (req, res) => {
    try {
      let profile = await Profile.find();
      res.send(profile);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

// Get a specific profile
app.get('/api/profile/:profileID', async (req, res) => {
    try {
        let profile = await Profile.findOne({_id:req.params.profileID});
        if (!profile) {
            res.sendStatus(404);
            return;
        }
        res.send(profile);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.put('/api/profile/:profileID', async (req, res) => {
    try {
        console.log(req.params.profileID); ///debug
        let profile = await Profile.findOne({_id:req.params.profileID});
        if (!profile) {
            res.sendStatus(404);
            return;
        }
        profile.name = req.body.name;
        profile.location = req.body.location;
        await profile.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

// Delete a profile
app.delete('/api/profile/:profileID', async (req, res) => {
    try {
        let profile = await Profile.findOne({_id:req.params.profileID});
        if (!profile) {
            res.send(404);
            return;
        }
        await profile.delete();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

// Schema for items
const itemSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'Profile'
    },
    name: String,
    path: String,
    discription: String,
    price: String
});

// Model for items
const Item = mongoose.model('Item',itemSchema);

//return all items
app.get('/api/items', async (req,res) => {
    try {
        let items = await Item.find();
        res.send(items);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//return specific item
app.get('/api/items/:itemID', async (req, res) => {
    try {
        let item = await Item.findOne({_id: req.params.itemID});
        if(!item) {
            res.send(404);
            return;
        }
        res.send(item);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//Methods by profile
app.post('/api/profiles/:profileID/items', async (req, res) => {
    try {
        let profile = await Profile.findOne({_id: req.params.profileID});
        if (!profile) {
            res.send(404);
            return;
        }
        let item = new Item({
            owner: profile,
            name: req.body.name,
            path: req.body.path,
            discription: req.body.discription,
            price: req.body.price
        });
        await item.save();
        res.send(item);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/profiles/:profileID/items', async (req, res) => {
    try {
        let profile = await Profile.findOne({_id: req.params.profileID});
        if (!profile) {
            res.send(404);
            return;
        }
        let items = await Item.find({owner:profile});
        res.send(items);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/profiles/:profileID/items/:itemID', async (req, res) => {
    try {
        let item = await Item.findOne({_id:req.params.itemID, owner: req.params.profileID});
        if (!item) {
            res.send(404);
            return;
        }
        item.name = req.body.name;
        item.path = req.body.path;
        item.discription = req.body.discription;
        item.price = req.body.price;
        await item.save();
        res.send(item);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/profiles/:profileID/items/:itemID', async (req, res) => {
    try {
        let item = await Item.findOne({_id:req.params.itemID, owner: req.params.profileID});
        if (!item) {
            res.send(404);
            return;
        }
        await item.delete();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));