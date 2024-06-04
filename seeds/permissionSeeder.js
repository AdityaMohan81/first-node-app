import Permission from "../models/permission.js";

const permissionSeeder = () => {
  // Insert permissions
  const permissions = [
    { name: "post-create", display_name: "Create Post", category: "Post" },
    { name: "post-view", display_name: "View Post", category: "Post" },
    { name: "post-update", display_name: "Update Post", category: "Post" },
    { name: "post-delete", display_name: "Delete Post", category: "Post" },

    {
      name: "user-create",
      display_name: "Create User",
      category: "User",
    },
    {
      name: "user-view",
      display_name: "View User",
      category: "User",
    },
    {
      name: "user-update",
      display_name: "Update User",
      category: "User",
    },
    {
      name: "user-delete",
      display_name: "Delete User",
      category: "User",
    },
  ];

  const seedPermissions = async () => {
    await Permission.deleteMany({});
    for (const permission of permissions) {
      const existingPermission = await Permission.findOne({
        name: permission.name,
      });
      if (!existingPermission) {
        const newPermission = new Permission(permission);
        await newPermission.save();
      }
    }
  };
  seedPermissions();
};

export default permissionSeeder;
