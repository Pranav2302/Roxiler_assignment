import prisma from "../config/db.js";

export const getAllStoreForRating = async (req,res)=>{
    try {
        const {name,address} = req.query;
        const userId = req.user.id;

        const where ={};
        if(name) where.name={contains :name,mode:'insensitive'};
        if(address) where.address = {contains:address,mode:'insensitive'};
        
        const stores = await prisma.store.findMany({
            where,
            select :{
                id:true,name:true,address:true,ratings:{select:{rating:true,userId:true}}
            }
        });

        const storesWithRatings = stores.map(store => {
            const allRatings = store.ratings;
            const userRating = allRatings.find(r => r.userId === userId);
            
            const overallRating = allRatings.length > 0 
                ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
                : "0.0";

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                overallRating,
                userSubmittedRating: userRating ? userRating.rating : null
            };
        });

        res.status(200).json({
            success: true,
            data: storesWithRatings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get stores"
        });
    }
}


// Get user's submit ratings
export const getMyRatings = async (req, res) => {
    try {
        const userId = req.user.id;

        const ratings = await prisma.rating.findMany({
            where: { userId },
            include: {
                store: {
                    select: { id: true, name: true, address: true }
                }
            }
        });

        res.status(200).json({
            success: true,
            data: ratings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get ratings"
        });
    }
};

// Submit or update rating for store
export const submitRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body;
        const userId = req.user.id;

        if (!storeId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Valid store ID and rating (1-5) are required"
            });
        }

        // already rated to this store
        const existingRating = await prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId,
                    storeId: parseInt(storeId)
                }
            }
        });

        let result;
        if (existingRating) {
            // Update existing rate
            result = await prisma.rating.update({
                where: {
                    userId_storeId: {
                        userId,
                        storeId: parseInt(storeId)
                    }
                },
                data: { rating: parseFloat(rating) }
            });
        } else {
            // Create new rating
            result = await prisma.rating.create({
                data: {
                    userId,
                    storeId: parseInt(storeId),
                    rating: parseFloat(rating)
                }
            });
        }

        res.status(200).json({
            success: true,
            message: existingRating ? "Rating updated" : "Rating submitted",
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to submit rating"
        });
    }
};