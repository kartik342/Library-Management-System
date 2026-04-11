import cron from "node-cron"
import { User } from "../models/userModel.js"

export const removeUnverifiedAccounts = () => {
    cron.schedule("*/5 * * * *", async () => { // this code runs every 5 minutes
        const thirtyMinutesBefore = new Date(Date.now() - 30 * 60 * 1000)
        await User.deleteMany({
            accountVerified: false,
            createdAt: { $lt: thirtyMinutesBefore }, // delete unverified accounts that were created more than 30 minutes ago
        })
        console.log("Unverified accounts removed successfully")
    })
}