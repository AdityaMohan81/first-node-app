import Joi from "joi";
import PostRepository from '../../repositories/postRepository.js';
const postRepo = new PostRepository;

/**
 * Add validation rules for the request*/
class GetPostRequest {
    static schema = Joi.object({
        id: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
    })
    constructor(req) {
        // console.log("🚀 ~ GetPostRequest ~ constructor ~ req.id:", req.id)
        this.data = req;
    }

    async validate() {
        const { error, value } = GetPostRequest.schema.validate(this.data, { abortEarly: false })
        console.log("🚀 ~ GetPostRequest ~ validate ~ error:", error)

        /**
        * Check id exist or not
        */

        const post = await postRepo.checkIdExists(this.data.id);
        // console.log("🚀 ~ GetPostRequest ~ validate ~ post:", post)
        if (error || post == null || post == undefined) {
            const validationErrors = {}
            error
                ? error.details.forEach((err) => {
                    validationErrors[err.context.key] = err.message;

                })
                : []
            if (post == null || post == undefined) {
                validationErrors['id'] =
                    'Invalid id provided.'
            }
            throw validationErrors
        }
        return value;
    }
}

export default GetPostRequest;