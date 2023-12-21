import TrackDistanceTime from "../controllers/track.controllers.js";

import Router from "express";
const TrackRoutes = Router.Router();

//Basic home
TrackRoutes.post("/track", TrackDistanceTime.track);

export default TrackRoutes;
