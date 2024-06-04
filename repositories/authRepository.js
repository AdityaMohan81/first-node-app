import User from "../models/user.js";

/**find by id */
export default class Auth {
    async findById(userId) {
        const user = await User.findById(userId);
        return user;
    }
}