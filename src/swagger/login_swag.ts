// KqRAMk5kpIsxOzxr

// mongodb+srv://abhayasaffron:KqRAMk5kpIsxOzxr@cluster0.trv0pxh.mongodb.net/

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login user
 *     description: Authenticate user with email and password
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: credentials
 *         description: User credentials for login
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
 *               example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Login successful
 *       400:
 *         description: Bad Request - Missing email or password
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Email and password are required
 *       401:
 *         description: Unauthorized - Invalid email or password
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Invalid email or password
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Internal Server Error
 */
