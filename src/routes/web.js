import express from "express";
import HomeController from "../controllers/HomeController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", HomeController.getHomePage);

  // setup get startrd button , whilelisted domain
  router.post("/setup-profile", HomeController.setupProfile);

  // setup persistent menu
  router.post("/setup-persistent-menu", HomeController.setupPersistentMenu);

  router.post("/webhook", HomeController.postWebhook);
  router.get("/webhook", HomeController.getWebhook);

  return app.use("/", router);
};

module.exports = initWebRoutes;
