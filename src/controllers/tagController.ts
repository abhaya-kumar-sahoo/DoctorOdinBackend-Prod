import { Response } from "express";
import { response } from "../response";
import TagModel from "../schemas/Tag";
export const addTag = async (req, res) => {
  try {
    const dataToInsert = req.body;
    if (!dataToInsert?.firstName) {
      return response(res, 400, "First Name is required", false);
    }

    const userId = req.user?.userId;

    dataToInsert.userId = userId;

    const existingTag = await TagModel.findOne({
      $and: [
        { userId: dataToInsert.userId },
        { firstName: dataToInsert.firstName },
      ],
    });

    if (existingTag) {
      return response(res, 409, "Tag already exists", false);
    }

    const tag = new TagModel(dataToInsert);

    const result = await tag.save();

    return response(res, 201, "tag added successfully", true, result);
  } catch (error) {
    return response(res, 500, "internal server error ", false, error.message);
  }
};

//this will give  all tags of a userId:
export const getAllTagsByUserId = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const tagsData = await TagModel.find({ userId: userId });
    if (tagsData.length < 0) {
      return response(res, 404, "data not found", false);
    }
    return response(res, 200, "data founded successfully", true, tagsData);
  } catch (error) {
    return response(res, 500, "internal server error ", false, error.message);
  }
};
