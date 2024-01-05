import Router from "express";
import Subscribers from "../controllers/subscribers.controllers.js";

const SubscribersRoute = {};
SubscribersRoute.protected = Router.Router();
SubscribersRoute.unprotected = Router.Router();

SubscribersRoute.unprotected.post("/subscribe/post", Subscribers.suscribe);
SubscribersRoute.protected.get("/subscribe/get", Subscribers.getSubscribers);

export default SubscribersRoute;
