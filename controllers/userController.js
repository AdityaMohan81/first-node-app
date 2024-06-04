import User from '../models/user.js';

/**
 * @swagger
 * /users/get:
 *   get:
 *     tags:
 *       - Users
 *     summary: Return logged in user details
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       422:
 *         description: Unprocessable Entity
 *       401:
 *         description: Unauthenticated
 */
const getUser = async (req, res) => {
    const user = await User.findById(req.session.user.id);
    // console.log("🚀 ~ getUser ~ req.params.id:", req.session.user.id)
    console.log("🚀 ~ getUser ~ user:", user)

    if (req.session.user) {
      res.json({
        status: true,
        message: "User profile details.",
        data: req.session.user,
      });
    } else {
      res.json({
        status: false,
        message: "User not found",
        data: [],
      });
    }
  };



// exports.getUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: 'User deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.listUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export { getUser };