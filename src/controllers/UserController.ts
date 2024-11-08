import UserModel from "@Odin/schemas/User";

export const getMyProfile = async (req: any, res: any) => {
  try {
    if (!req?.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user logged in" });
    }
    // Find user by email
    const user = await UserModel.findById(req?.user?.userId).select(
      "-password"
    );

    // Return JWT token in response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
