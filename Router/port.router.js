const express = require("express");
const route = express.Router();
const fs = require("fs");
const path = require("path");

const dataPortPath = path.join(__dirname, "../data/posts.json");
// console.log("Data Port ====>", dataPortPath);

route
  .route("/")
  .get((req, res) => {
    fs.readFile(dataPortPath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error reading users data" });
      }
      const dbPortJson = JSON.parse(data);
      res.status(200).send(dbPortJson);
    });
  })
  .post((req, res) => {
    fs.readFile(dataPortPath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error reading users data" });
      }
      const convertData = JSON.parse(data);
      const newPost = {
        userId: req.body.userId,
        id: convertData[convertData.length - 1].id + 1,
        title: req.body.title,
        body: req.body.body,
      };

      convertData.push(newPost);
      fs.writeFile(dataPortPath, JSON.stringify(convertData), (err) => {});
      if (err) {
        return res.status(500).send({ error: "Error" });
      }
      res.status(200).send({ message: "Create successfully" });
    });
  });

route
  .route("/:id")
  .get((req, res) => {
    const dbId = req.params.id;
    fs.readFile(dataPortPath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error reading users data" });
      }
      const dbJson = JSON.parse(data);
      const dbIndexPort = dbJson.find((id) => id.id == dbId);
      console.log("Id ra chưa con đĩ ===>", dbIndexPort);
      res.status(200).send(dbIndexPort);
    });
  })
  .put((req, res) => {
    const dbId = req.params.id;
    fs.readFile(dataPortPath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error reading users data" });
      }
      const dbJson = JSON.parse(data);
      const dbIndexPort = dbJson.findIndex((port) => port.id == dbId);
      if (dbIndexPort == -1) {
        return res.status(404).send({ error: "Not found" });
      }
      const updatedPost = {
        userId: req.body.userId,
        id: dbJson[dbIndexPort].id,
        title: req.body.title || dbJson[dbIndexPort].title,
        body: req.body.body || dbJson[dbIndexPort].body,
      };
      console.log(updatedPost);
      dbJson[dbIndexPort] = { ...dbJson[dbIndexPort], ...updatedPost };
      fs.writeFile(dataPortPath, JSON.stringify(dbJson), (err) => {
        if (err) {
          return res.status(500).send({ error: "Error" });
        }
        res.status(200).send({ message: "Update successfully" });
      });
    });
  })
  .delete((req, res) => {
    const dbId = req.params.id;
    fs.readFile(dataPortPath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error reading users data" });
      }
      const dbJson = JSON.parse(data);
      const dbIndexUser = dbJson.findIndex((id) => id.id == dbId);
      if (dbIndexUser == -1) {
        return res.status(404).send({ error: "Not found" });
      }
      dbJson.splice(dbIndexUser, 1);
      fs.writeFile(dataPortPath, JSON.stringify(dbJson), (err) => {
        if (err) {
          return res.status(500).send({ error: "Error" });
        }
      });
      res.status(200).send({ message: "Delete successfully" });
    });
  });

module.exports = route;
