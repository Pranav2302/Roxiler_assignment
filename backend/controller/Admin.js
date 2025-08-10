import prisma from "../config/db.js";
import bcrypt from "bcrypt";

// Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            prisma.user.count(),
            prisma.store.count(),
            prisma.rating.count()
        ]);

        res.status(200).json({
            success: true,
            data: { totalUsers, totalStores, totalRatings }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve dashboard stats"
        });
    }
};

// Admin adding new users 
export const addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        
        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, address, role }
        });

        const { password: _, ...userResponse } = newUser;
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userResponse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
};

// Admin adding new stores
export const addStore = async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;

        if (!name || !email || !address || !ownerId) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        // Check if owner exists and is STORE_OWNER of shop
        const owner = await prisma.user.findUnique({
            where: { id: parseInt(ownerId) }
        });

        if (!owner || owner.role !== 'STORE_OWNER') {
            return res.status(400).json({
                success: false,
                message: "Invalid owner or owner must be STORE_OWNER"
            });
        }

        const newStore = await prisma.store.create({
            data: {
                name, email, address,
                ownerId: parseInt(ownerId)
            }
        });

        res.status(201).json({
            success: true,
            data: newStore
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create store"
        });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const { name, email, role } = req.query;

        const where = {};
        if (name) where.name = { contains: name, mode: 'insensitive' };
        if (email) where.email = { contains: email, mode: 'insensitive' };
        if (role) where.role = role;

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true, name: true, email: true, 
                address: true, role: true
            }
        });

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get users"
        });
    }
};

// Get all stores
export const getAllStores = async (req, res) => {
    try {
        const { name, email, address } = req.query;

        const where = {};
        if (name) where.name = { contains: name, mode: 'insensitive' };
        if (email) where.email = { contains: email, mode: 'insensitive' };
        if (address) where.address = { contains: address, mode: 'insensitive' };

        const stores = await prisma.store.findMany({
            where,
            select: {
                id: true, name: true, email: true, address: true,
                ratings: { select: { rating: true } }
            }
        });

        // Add average rating to each store
        const storesWithRating = stores.map(store => {
            const avgRating = store.ratings.length > 0 
                ? parseFloat((store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length).toFixed(1))
                : 0;
            
            return {
                ...store,
                averageRating: avgRating,
                ratings: undefined
            };
        });

        res.status(200).json({
            success: true,
            data: storesWithRating
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get stores"
        });
    }
};

// Get user details by ID
export const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                id: true, name: true, email: true, 
                address: true, role: true,
                ownedStores: {
                    select: { id: true, name: true, address: true }
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get user details"
        });
    }
};