import prisma from "../config/db.js"

export const getOwnerDashboard = async (req,res)=>{
    try {
        const ownerId = req.user.id;

        const store = await prisma.store.findFirst({
            where:{ownerId},
            include:{
                rating:{
                    include:{
                        user:{
                            select:{id:true,name:true,email:true}
                        }
                    }
                }
            }
        });
    if (!store) {
        return res.status(404).json({
            success:false,
            message:"store not found"
        });
    }

    // coming here that means , having store ,then Calculate average rating
        const avgRating = store.ratings.length > 0 
            ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
            : 0;
        
        res.status(200).json({
            success: true,
            data: {
                storeName: store.name,
                averageRating: avgRating.toFixed(1),
                totalRatings: store.ratings.length,
                usersWhoRated: store.ratings.map(r => ({
                    userId: r.user.id,
                    userName: r.user.name,
                    userEmail: r.user.email,
                    rating: r.rating
                }))
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get dashboard data"
        });  
    }
}


// Get store owner's store information
export const getMyStore = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const store = await prisma.store.findFirst({
            where: { ownerId },
            select: {
                id: true,
                name: true,
                email: true,
                address: true
            }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        res.status(200).json({
            success: true,
            data: store
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get store details"
        });
    }
};


// Get all ratings information from store owners store
export const getMyStoreRatings = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const ratings = await prisma.rating.findMany({
            where: {
                store: { ownerId }
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
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