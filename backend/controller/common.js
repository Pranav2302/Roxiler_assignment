import prisma from "../config/db.js";
import bcrypt from "bcrypt";

// Change password for any role
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both old and new passwords are required"
            });
        }

        // Password validation regex
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password must be 8-16 characters with at least one uppercase letter and one special character"
            });
        }

        // Getting user
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Up  -- db
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
};