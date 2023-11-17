import asyncHandler from "express-async-handler";
import responseHandle from "../../utils/handleResponse.js";
import TestimonialModel from "../../models/testimonials.model.js";

const adminTestimonial = {};

adminTestimonial.update = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Testimonial Route']
  const { name, title, content, _id } = req.body;
  const check = await TestimonialModel.findById(_id);
  const contentTaken = await TestimonialModel.findOne({ content: content });

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    if (contentTaken) {
      res.status(400);
      throw new Error("already created");
    }

    if (!name) {
      res.status(400);
      throw new Error("No name provided");
    }

    if (!content) {
      res.status(400);
      throw new Error("No content provided");
    }

    const updatedTestimonial = await TestimonialModel.findByIdAndUpdate(
      _id,
      {
        name,
        title,
        content,
      },
      {
        new: true,
      }
    );
    if (!updatedTestimonial) {
      res.status(500);
      throw new Error("could not update Testimonial");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Testimonial updated successfully.",
        updatedTestimonial
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminTestimonial.approve = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Testimonial Route']
  const check = await TestimonialModel.findById(req.params.id);

  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const approvedTestimonial = await TestimonialModel.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      {
        new: true,
      }
    );
    if (!approvedTestimonial) {
      res.status(500);
      throw new Error("could not approve Testimonial");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Testimonial successfully Approved.",
        approvedTestimonial
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminTestimonial.delete = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Testimonial Route']
  const check = await TestimonialModel.findById(req.params.id);
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }
    // todo: find out what dis returns
    const deleteTestimonial = await TestimonialModel.findByIdAndDelete(
      req.params.id
    );

    if (!deleteTestimonial) {
      res.status(500);
      throw new Error("could not delete Testimonial");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Testimonial deleted successfully.",
        "Testimonial deleted"
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminTestimonial.getUnapproved = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Testimonial Route']
  try {
    // todo: find out what dis returns
    const testimonials = await TestimonialModel.find({
      status: "not approved",
    }).populate("user_id", "image");

    if (!testimonials) {
      res.status(500);
      throw new Error("could not retrieve Testimonial");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Unapproved Testimonials retrieved successfully.",
        testimonials
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default adminTestimonial;
