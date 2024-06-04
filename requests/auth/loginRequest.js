import asyncHandler from "express-async-handler";
import { make, Password } from "simple-body-validator";

const loginValidation = asyncHandler(async (req, res, next) => {

  const rules = {
    email: "required|email",
    password: [
      "required",
      Password.create().min(8).mixedCase().numbers().symbols(),
    ],
  };

  const validator = make().setData(req.body).setRules(rules);
  if (!validator.validate()) {
    const errors = validator.errors().all();
    return res.status(400).json({
      status: false,
      message: "Validation failed",
      errors: errors,
    });
  }
  next();
});

export { loginValidation };
