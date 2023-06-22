const express = require("express");
const route = express.Router();
const fs = require("fs");
const path = require("path");

const dataUsersPath = path.join(__dirname, "../data/users.json");
// console.log("Data User ==>", dataUsersPath);

route
  .route("/")
  .get((req, res) => {
    fs.readFile(dataUsersPath, (err, data) => {
      if (err) {
        res.status(500).json({ error: "Error reading users data" });
        return;
      }
      const dbUserJson = JSON.parse(data);
      // console.log(dbUserJson);
      res.status(200).send(dbUserJson);
    });
  })
  .post((req, res) => {
    // console.log(req.body);
    fs.readFile(dataUsersPath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error reading users data" });
      }
      const convertData = JSON.parse(data);
      const newUser = {
        id: convertData[convertData.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        address: {
          street: req.body.address.street,
          suite: req.body.address.suite,
          city: req.body.address.city,
          zipcode: req.body.address.zipcode,
          geo: {
            lat: req.body.address.geo.lat,
            lng: req.body.address.geo.lng,
          },
        },
        phone: req.body.phone,
        website: req.body.website,
        company: {
          name: req.body.company.name,
          catchPhrase: req.body.company.catchPhrase,
          bs: req.body.company.bs,
        },
      };

      convertData.push(newUser);
      fs.writeFile(dataUsersPath, JSON.stringify(convertData), (err) => {
        if (err) {
          return res.status(500).send({ error: "Error" });
        }
      });
      res.status(200).send({ message: "Create successfully" });
    });
  });

route
  .route("/:id")
  .get((req, res) => {
    const dbId = req.params.id;
    // console.log("dbId ===> ", dbId);
    fs.readFile(dataUsersPath, (err, data) => {
      if (err) {
        res.status(500).json({ error: "Error reading users data" });
        return;
      }
      const dbJson = JSON.parse(data);
      const dbIndexUser = dbJson.find((id) => id.id == dbId);
      console.log("dbUser ===> ", dbIndexUser);
      res.status(200).send(dbIndexUser);
    });
  })
  .put((req, res) => {
    const dbId = req.params.id;
    fs.readFile(dataUsersPath, (err, data) => {
      if (err) {
        return;
        res.status(500).json({ error: "Error reading users data" });
      }
      const dbJson = JSON.parse(data);
      const dbIndexUser = dbJson.findIndex((id) => id.id == dbId);
      if (dbIndexUser === -1) {
        res.status(404).json({ error: "Question not found" });
      } else {
        const updatedUser = {
          id: dbJson[dbIndexUser].id,
          name: req.body.name || dbJson[dbIndexUser].name,
          username: req.body.username || dbJson[dbIndexUser].username,
          email: req.body.email || dbJson[dbIndexUser].email,
          address: {
            street:
              req.body.address?.street || dbJson[dbIndexUser].address.street,
            suite: req.body.address?.suite || dbJson[dbIndexUser].address.suite,
            city: req.body.address?.city || dbJson[dbIndexUser].address.city,
            zipcode:
              req.body.address?.zipcode || dbJson[dbIndexUser].address.zipcode,
            geo: {
              lat:
                req.body.address?.geo?.lat ||
                dbJson[dbIndexUser].address.geo.lat,
              lng:
                req.body.address?.geo?.lng ||
                dbJson[dbIndexUser].address.geo.lng,
            },
          },
          phone: req.body.phone || dbJson[dbIndexUser].phone,
          website: req.body.website || dbJson[dbIndexUser].website,
          company: {
            name: req.body.company?.name || dbJson[dbIndexUser].company.name,
            catchPhrase:
              req.body.company?.catchPhrase ||
              dbJson[dbIndexUser].company.catchPhrase,
            bs: req.body.company?.bs || dbJson[dbIndexUser].company.bs,
          },
        };
        dbJson[dbIndexUser] = updatedUser;
        fs.writeFile(dataUsersPath, JSON.stringify(dbJson), (err) => {
          if (err) {
            return res.status(500).send({ error: "Error" });
          }
          res.status(200).send({ message: "Update successful" });
        });
      }
    });
  })
  .delete((req, res) => {
    const dbId = req.params.id;
    fs.readFile(dataUsersPath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error reading users data" });
      }
      const dbJson = JSON.parse(data);
      const dbIndexUser = dbJson.findIndex((id) => id.id == dbId);
      if (dbIndexUser == -1) {
        return res.status(404).json({ error: "User not found" });
      }
      dbJson.splice(dbIndexUser, 1);
      fs.writeFile(dataUsersPath, JSON.stringify(dbJson), (err) => {
        if (err) {
          return res.status(500).send({ error: "Error" });
        }
      });
      res.status(200).send({ message: "Delete successful" });
    });
  });

module.exports = route;
