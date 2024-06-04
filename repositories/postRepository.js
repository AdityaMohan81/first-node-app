import Post from '../models/post.js'
import slug from 'slug'

export default class PostRepository {

    /**
     * Add Post
     * @param Array offerData
     * @return Post post
     */
    async addOffer(offerData) {
        const post = new Post()
        Object.keys(offerData).forEach((key) => {
            post[key] = offerData[key]
        })
        post.save()
        return post
    }

    /**
     * List post
     * @param number pageNumber
     * @return Post post
     */
    async listOffer(pageNumber, keyword, publicFilter) {
        const ITEMS_PER_PAGE = 10
        const page = parseInt(pageNumber) || 1
        let query = {}
        if (keyword) {
            const regex = new RegExp(keyword, 'i') // "i" makes the search case-insensitive
            query = { name: regex }
        }

        if (publicFilter) {
            query = {
                ...query,
                status: true,
                valid_from: { $lte: new Date() },
                valid_to: { $gte: new Date() },
            }
        }
        const result = await Post.paginate(query, {
            page: page,
            limit: ITEMS_PER_PAGE,
            populate: 'promocode',
        })
        const { docs, total } = result
        return { items: docs, total }
    }

    /**
     * Get post
     * @param Array offerData
     * @return Post post
     */
    async getOffer(offerData) {
        const post = await Post.findOne({ _id: offerData.id }).populate([
            'promocode',
        ])
        return post
    }

    /**
     * Update post
     * @param Array offerData
     * @return Post post
     */
    async updateOffer(offerData) {
        const post = await Post.findOne({ _id: offerData.id })
        if (post) {
            if (offerData.name) {
                const slugText = slug(offerData.name)
                offerData.slug = slugText
                const checkSlugExists = await this.checkSlugExists(offerData)
                if (checkSlugExists) {
                    //generate random number
                    const min = 1
                    const max = 10
                    const randomInteger =
                        Math.floor(Math.random() * (max - min + 1)) + min

                    //generate new slug
                    const slugText = slug(offerData.name + randomInteger)
                    offerData.slug = slugText
                }
            }

            Object.keys(offerData).forEach((key) => {
                post[key] = offerData[key]
            })
            const updatedoffer = await post.save()
            return updatedoffer
        }
    }

    /**
     * Delete post
     * @param Array offerData
     * @return Boolean true/false
     */
    async deleteOffer(offerData) {
        const findOffer = await Post.findOne({ _id: offerData.id })
        if (findOffer) {
            await Post.findOneAndDelete({
                _id: offerData.id,
            })
            return true
        } else {
            return false
        }
    }

    /**
     * Update post status
     * @param string id - Post ID
     * @param string status - Post status as a string ("true" or "false")
     * @return Post post
     */
    async updateOfferStatus(offerData) {
        const post = await Post.findOne({ _id: offerData.id })
        if (post) {
            const parsedStatus = offerData.status === 'true' // Convert the status string to boolean
            post.status = parsedStatus

            const updatedOffer = await post.save()
            return updatedOffer
        }

        return null // Return null if the post with the given ID doesn't exist
    }

    /**
     * Check slug exists
     * @param Array validatedData
     * @return Post post
     */
    async checkSlugExists(validatedData) {
        const post = await Post.findOne({ slug: validatedData.slug })
        return post
    }

    /**
     * Check id exists
     * @param Array offerData
     * @return Post post
     */
    async checkIdExists(offerData) {
        const post = await Post.findOne({ _id: offerData.id })
        return post
    }

}
