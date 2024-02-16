const joi=require('joi')

module.exports.listingSchema=joi.object({
    listings : joi.object({
        title: joi.string().required(),
        description:joi.string().required(),
        price:joi.number().required().min(0),
        country:joi.string().required(),
        location:joi.string().required(),
        image: joi.string().allow("",null)
    }).required()
})
module.exports.reviewSchema=joi.object({
    review : joi.object({
        comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5),
    }).required()
})