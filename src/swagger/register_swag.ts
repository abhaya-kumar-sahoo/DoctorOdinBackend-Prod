/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Registers a new user with the provided information
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User object containing user details for registration
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: example@gmail.com
 *             password:
 *               type: string
 *               format: password
 *               example: password123
 *             phoneNumber:
 *               type: string
 *               example: "1234567890"
 *             age:
 *               type: integer
 *               example: 25
 *             height:
 *               type: number
 *               example: 175
 *             weight:
 *               type: number
 *               example: 70
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User registered successfully
 *       400:
 *         description: Bad Request - Missing required fields or user already exists
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Missing required fields- email, password
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Internal Server Error
 */
