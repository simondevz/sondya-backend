import asyncHandler from "express-async-handler";
import ServiceModel from "../../models/services.model.js";
import responseHandle from "../../utils/handleResponse.js";

const adminServices = {};

adminServices.create = asyncHandler(async (req, res) => {
  const {
    name,
    user,
    category,
    brief_description,
    description,
    tag,
    current_price,
    service_status,
  } = req.body;

  try {
    const serviceTaken = await ServiceModel.findOne({ name: name.trim() });
    if (serviceTaken) {
      res.status(400);
      throw new Error("service name is taken");
    }

    const newService = await ServiceModel.create({
      name: name.trim(),
      user: user.trim(),
      category: category.trim(),
      brief_description: brief_description.trim(),
      description: description.trim(),
      tag: tag.trim(),
      service_status: service_status.trim(),
      current_price: current_price,
    });

    if (!newService) {
      res.status(500);
      throw new Error("could not create new services");
    }

    responseHandle.successResponse(
      res,
      201,
      "services created successfully.",
      newService
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminServices.update = asyncHandler(async (req, res) => {
  const check = await ServiceModel.findById(req.params.id);

  const {
    name,
    user,
    category,
    brief_description,
    description,
    tag,
    current_price,
    service_status,
  } = req.body;

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const updatedServices = await ServiceModel.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        user: user.trim(),
        category: category.trim(),
        brief_description: brief_description.trim(),
        description: description.trim(),
        tag: tag.trim(),
        service_status: service_status.trim(),
        current_price: current_price,
      },
      {
        new: true,
      }
    );

    if (!updatedServices) {
      res.status(500);
      throw new Error("could not update services");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "services updated successfully.",
        updatedServices
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminServices.delete = asyncHandler(async (req, res) => {
  const check = await ServiceModel.findById(req.params.id);

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    const deleteServices = await ServiceModel.findByIdAndDelete(req.params.id);

    if (!deleteServices) {
      res.status(500);
      throw new Error("could not delete services");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "services deleted successfully.",
        "services deleted"
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminServices.getById = asyncHandler(async (req, res) => {
  const serviceDetails = await ServiceModel.findById(req.params.id);

  try {
    if (!serviceDetails) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "service details found successfully.",
        serviceDetails
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminServices.getAll = asyncHandler(async (req, res) => {
  const getall = await ServiceModel.find();
  try {
    if (!getall) {
      res.status(404);
      throw new Error("Id not found");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "services found successfully.",
        getall
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default adminServices;
