import Joi from 'joi'
import cleanErrorMessage from '../../utils/cleanErrorMessage.js'

class AddUserRequest {

    /**
     * Add validation rules for the request
     */
    static schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Please enter the  name.',
            'any.required': 'Please enter the  name.',
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Please enter a valid email address.',
            'any.required': 'Please enter a valid email address.',
            'string.email': 'Please enter a valid email address.',
        }),
        password: Joi.string().required().messages({
            'any.required': `Password field cannot be left blank. Ensure your account's security by entering a new password.`,
            'string.empty': `Password field cannot be left blank. Ensure your account's security by entering a new password.`,
        }),
        confirm_password: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.required':
                    'This field cannot be empty. Please enter the password to confirm.',
                'string.empty':
                    'This field cannot be empty. Please enter the password to confirm.',
                'any.only':
                    'It looks like the passwords you entered do not match. Please double-check your passwords and try again.',
            }),
    })
    constructor(req) {
        this.data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirm_password: req.body.confirm_password
        }
    }
    async validate() {
        const { error, value } = AddUserRequest.schema.validate(this.data, {

            abortEarly: false,
        })
        if (error) {
            const validationErrors = {}
            error
                ? error.details.forEach((err) => {
                    validationErrors[err.context.key] = cleanErrorMessage(err.message)
                })
                : []
            throw validationErrors
        }
        return value
    }
}
export default AddUserRequest