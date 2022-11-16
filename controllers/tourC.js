import Tour from "../models/tourModel.js";
import mongoose from "mongoose";

export const createTour = async (req, res) => {
  const tour = req.body;
  console.log(req.body);
  const newTour = new Tour({
    ...tour,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(404).json({ message: "something went wrong ceratetour" });
  }
};

export const getTours = async (req, res) => {
  const { page } = req.query;
  try {
    // const tours = await Tour.find();
    // res.status(200).json(tours);
    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    const total = await Tour.countDocuments({});
    const tours = await Tour.find().limit(limit).skip(startIndex);
    res.json({
      data: tours,
      currentPage: Number(page),
      totalTours: total,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(404).json({ message: "something went wrong gettourss" });
  }
};

export const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json(tour);
  } catch (error) {
    res.status(404).json({ message: "something went wrong gettour " });
  }
};

export const getToursByUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "user doesnt exist" });
  }
  const userTours = await Tour.find({ creator: id });
  res.status(200).json(userTours);
};

export const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: "doenst hve a tour with this is id" });
    }
    await Tour.findByIdAndRemove(id);
    return res.status(200).json({ message: "tour is deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "something went wrong deletetour " });
  }
};

export const updateTour = async (req, res) => {
  const { id } = req.params;
  const { title, description, creator, imageFile, tags } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: "doenst hve a tour with this is id" });
    }
    let updatedTour = {
      title,
      description,
      creator,
      imageFile,
      tags,
      _id: id,
    };
    await Tour.findByIdAndUpdate(id, updatedTour, { new: true });
    return res.status(200).json(updatedTour);
  } catch (error) {
    res.status(404).json({ message: "something went wrong updatetour" });
  }
};

export const getTourBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");
    const tours = await Tour.find({ title });
    res.status(200).json(tours);
  } catch (error) {
    res.status(404).json({ message: "something went wrong with search" });
  }
};
export const getTourByTags = async (req, res) => {
  const { tag } = req.params;

  try {
    const tours = await Tour.find({ tags: { $in: tag } });
    res.status(200).json(tours);
  } catch (error) {
    res.status(404).json({ message: "something went wrong with tags" });
  }
};
export const getRelatedTour = async (req, res) => {
  const tags = req.body;

  try {
    const tours = await Tour.find({ tags: { $in: tags } });
    res.status(200).json(tours);
  } catch (error) {
    res.status(404).json({ message: "something went wrong with relatedTours" });
  }
};

export const likeTour = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId) {
      res.status(400).json({ message: "user is not authenticated" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: "doenst hve a tour with this is id" });
    }
    const tour = await Tour.findById(id);
    const index = tour.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
      tour.likes.push(req.userId);
    } else {
      tour.likes = tour.likes.filter((id) => id !== String(req.userId));
    }
    const updatedTour = await Tour.findByIdAndUpdate(id, tour, { new: true });
    res.status(200).json(updatedTour);
  } catch (error) {
    console.log("errror", error);
    res.status(404).json({ message: "something went wrong with likes" });
  }
};
