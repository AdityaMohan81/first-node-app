import User from '../models/user.js';
import Role from "../models/role.js";

// mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected...'))
//   .catch(err => console.log(err));

const userSeeder = async () => {
  const userData = {
    name: "Super Admin",
    email: "info@diamondlease.com",
    password: "Admin123,.",
    guard: "admin",
    role_id: null, // Initializing role_id to null
    // permissions: ["user-create", "user-update", "user-delete", "user-view", "post-create", "post-view", "post-delete", "post-update"],
  };


  try {
    const existingEmployee = await User.findOne({ email: userData.email });
    if (existingEmployee) {
      console.log("User already exists");
      return;
    }

    const role = await Role.findOne({ name: userData.name }); // Find role by name
    if (!role) {
      console.error("Role does not exist:", userData.name);
      return;
    }

    userData.role_id = role._id; // Set role ID
    const newEmployee = new User(userData);
    await newEmployee.save();
    console.log("User seeded successfully");
  } catch (error) {
    console.error("Error seeding employee:", error);
  }
};

export default userSeeder;
