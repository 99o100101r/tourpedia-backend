import express from "express";
import {
  getTours,
  createTour,
  getTour,
  getToursByUser,
  deleteTour,
  updateTour,
  getTourBySearch,
  getTourByTags,
  getRelatedTour,
  likeTour,
} from "../controllers/tourC.js";
import tourM from "../middleware/authM.js";

const router = express.Router();

router.post("/", tourM, createTour);
router.delete("/deleteTour/:id", tourM, deleteTour);
router.patch("/updateTour/:id", tourM, updateTour);
router.get("/getToursByUser/:id", tourM, getToursByUser);
router.patch("/like/:id", tourM, likeTour);

router.get("/search", getTourBySearch);
router.get("/byTags/:tag", getTourByTags);
router.post("/getRelatedTours/", getRelatedTour);

router.get("/", getTours);
router.get("/:id", getTour);

export default router;
