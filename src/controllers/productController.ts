import { Request, Response } from "express";
import { Product } from "@Odin/schemas/ProductCatlog";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import config from "dotenv";
config.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
// console.log("AWS_ACCESS_KEY_ID",process.env.AWS_SECRET_ACCESS_KEY);

// console.log(process.env);
export const createProductController = async (req, res: Response) => {
  try {
    // Extract name, image, and price from the request body
    const { name, price, moddleNo, originalPrice, link } = req.body;

    // Initialize an array to store missing fields
    const missingFields: string[] = [];

    // Check each field individually
    if (!name) {
      missingFields.push("name");
    }
    if (!req?.file) {
      missingFields.push("image");
    }
    if (!price) {
      missingFields.push("price");
    }
    if (!moddleNo) {
      missingFields.push("moddleNo");
    }
    if (!originalPrice) {
      missingFields.push("originalPrice");
    }
    if (!link) {
      missingFields.push("link");
    }

    // If any field is missing, return a 400 error with the missing fields
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `The following field(s) are required: ${missingFields.join(
          ", "
        )}`,
      });
    }

    // // Generate a unique filename for the image
    const filename = `${uuidv4()}.webp`;

    // // Upload image to S3 bucket
    await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: req.file?.buffer,
        ContentType: req?.file?.mimetype,
      })
      .promise();

    // Construct the URL of the uploaded image
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${filename}`;

    // Create a new product instance
    const product = new Product({
      name,
      image: imageUrl,
      price,
      moddleNo,
      originalPrice,
      link,
    });

    // Save the product to the database
    await product.save();

    // Send a success response with status code 201
    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (err) {
    // Handle errors
    console.error(err);
    // Send an error response with status code 500
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Validate page and limit parameters
    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid page or limit value" });
    }

    // Search by name if query param 'q' is provided
    const searchQuery = req.query.q
      ? { name: { $regex: req.query.q, $options: "i" } }
      : {};

    // Get total count of products based on search query
    const totalCount = await Product.countDocuments(searchQuery);

    // Fetch products from the database based on search query
    const products = await Product.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ position: 1 });

    // If no products found, return 404 error
    if (products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    // Return products along with pagination metadata
    res.status(200).json({
      products,
      pageInfo: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Validate if productId is provided
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Find the product by its ID
    const product = await Product.findById(productId);

    // If product is not found, return 404 error
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the product
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res: Response) => {
  // console.log("gfcg", req.file);

  try {
    // console.log(req.params);
    // Extracting parameters from request body
    const { name, price, image, moddleNo, originalPrice, link, position } =
      req.body;
    const { productId } = req.params;

    // Validating productId
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    if (
      (!name &&
        !price &&
        !req.file &&
        !moddleNo &&
        !originalPrice &&
        !link &&
        !position) ||
      (price && isNaN(price)) // Add condition for position
    ) {
      return res.status(400).json({ error: "Invalid update data" });
    }

    // Constructing the update object
    const update: any = {};
    if (name) {
      update.name = name;
    }
    if (price) {
      update.price = parseFloat(price);
    }
    if (originalPrice) {
      update.originalPrice = parseFloat(originalPrice);
    }
    if (req.file) {
      // Delete the image from S3 if it exists
      const product = await Product.findById(productId);

      const filename = product.image.split("/").pop(); // Extract filename from image URL
      console.log("product image name", filename);
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: filename,
        })
        .promise();

      // Generate a unique filename for the image
      const newFilename = `${uuidv4()}.webp`;

      // Upload image to S3 bucket
      await s3
        .upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: newFilename,
          Body: req.file?.buffer,
          ContentType: req?.file?.mimetype,
        })
        .promise()
        .then((data) => {})
        .catch((err) => {
          console.log("err", err);
          return res
            .status(500)
            .json({ error: "Internal Server Error", err: err });
        });

      // Construct the URL of the uploaded image
      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${newFilename}`;

      update.image = imageUrl;
    }

    if (moddleNo) {
      update.moddleNo = moddleNo;
    }
    if (link) {
      update.link = link;
    }

    // Updating updatedAt field
    update.updatedAt = new Date();

    // Updating the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(productId, update, {
      new: true,
    });

    // If product not found, return 404 error
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Sending success response
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    // Handling errors
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProductOrder = async (req: Request, res: Response) => {
  try {
    const { position } = req.body;
    const { productId } = req.params;

    // Validate productId format
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    // Validate position
    if (position === undefined || isNaN(position)) {
      return res.status(400).json({ error: "Invalid position data" });
    }

    // Find the product by its ID
    const product = await Product.findById(productId);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the product with the specified position
    const productWithPosition = await Product.findOne({ position });

    // If a product already exists at the target position, shift other products
    if (productWithPosition) {
      await Product.updateMany(
        { position: { $gte: position } },
        { $inc: { position: 1 } }
      );
    }

    // Update the position of the product
    product.position = position;
    product.updatedAt = new Date();

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product order updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // Extracting productId from request parameters
    const { productId } = req.params;

    // Validating productId
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }
    const product = await Product.findById(productId);

    // Finding the product by productId and deleting it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    const filename = product.image.split("/").pop(); // Extract filename from image URL
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
      })
      .promise();
    // If product not found, return 404 error
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Sending success response
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    // Handling errors
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
