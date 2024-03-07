/**
 * @swagger
 * /product:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Product
 *     summary: Create a new product
 *     description: Endpoint to create a new product
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Access token
 *         required: true
 *         type: string
 *         default: "Bearer <YourTokenHere>"
 *       - in: body
 *         name: product
 *         description: Product data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Name of the product
 *             image:
 *               type: string
 *               description: URL of the product image
 *             price:
 *               type: number
 *               description: Price of the product
 *     responses:
 *       201:
 *         description: Product created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Product created successfully
 *             product:
 *               $ref: "#/definitions/Product"
 *       400:
 *         description: Bad Request - Missing required fields
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: The following field(s) are required- name, image, price
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Internal Server Error
 * definitions:
 *   Product:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         description: Name of the product
 *       image:
 *         type: string
 *         description: URL of the product image
 *       price:
 *         type: number
 *         description: Price of the product
 */
/**
 * @swagger
 * /product/{productId}:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Product
 *     summary: Update a product
 *     description: Endpoint to update an existing product
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID of the product to update
 *         required: true
 *         type: string
 *         format: uuid
 *       - in: header
 *         name: Authorization
 *         description: Access token
 *         required: true
 *         type: string
 *         default: "Bearer <YourTokenHere>"
 *       - in: body
 *         name: product
 *         description: Updated product data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Name of the product
 *             price:
 *               type: number
 *               description: Price of the product
 *             image:
 *               type: string
 *               description: URL of the product image
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Product updated successfully
 *             product:
 *               $ref: "#/definitions/Product"
 *       400:
 *         description: Bad Request - Invalid product data
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Invalid update data
 *       404:
 *         description: Not Found - Product not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Product not found
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Internal Server Error
 * definitions:
 *   Product:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         description: Name of the product
 *       price:
 *         type: number
 *         description: Price of the product
 *       image:
 *         type: string
 *         description: URL of the product image
 */
/**
 * @swagger
 * /products:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Product
 *     summary: Get products
 *     description: Retrieve a list of products with pagination and search functionality
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Access token
 *         required: true
 *         type: string
 *         default: "Bearer <YourTokenHere>"
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         required: false
 *         type: integer
 *       - in: query
 *         name: limit
 *         description: Number of products per page
 *         required: false
 *         type: integer
 *       - in: query
 *         name: q
 *         description: Search query for product name
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/Product"
 *             pageInfo:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of products
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *       400:
 *         description: Bad Request - Invalid page or limit value
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Invalid page or limit value
 *       404:
 *         description: Not Found - No products found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: No products found
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Internal Server Error
 * definitions:
 *   Product:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         description: Name of the product
 *       price:
 *         type: number
 *         description: Price of the product
 *       image:
 *         type: string
 *         description: URL of the product image
 */
/**
 * @swagger
 * /product/{productId}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Product
 *     summary: Delete a product
 *     description: Endpoint to delete an existing product by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID of the product to delete
 *         required: true
 *         type: string
 *         format: uuid
 *       - in: header
 *         name: Authorization
 *         description: Access token
 *         required: true
 *         type: string
 *         default: "Bearer <YourTokenHere>"
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Product deleted successfully
 *       400:
 *         description: Bad Request - Invalid product ID
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Invalid productId
 *       404:
 *         description: Not Found - Product not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Product not found
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Internal Server Error
 */
//# sourceMappingURL=product.js.map