import cron from "node-cron"
import { sendEmail } from "../utils/sendEmail.js"
import { User } from "../models/userModel.js"
import { Borrow } from "../models/borrowModel.js"

export const notifyUser = () => {
    cron.schedule("*/30 * * * *", async () => { // this code runs every 30 minutes
        try {
            const oneDayBefore = new Date(Date.now() - 24 * 60 * 60 * 1000)
            const borrowers = await Borrow.find({
                dueDate: { $lt: oneDayBefore },
                returnDate: null,
                notified: false,
            }) 

            for(const element of borrowers){
                if(element.user && element.user.email){
                    // Send notification to the user
                    const user = await User.findById(element.user.id)
                    sendEmail({
                        email: user.email,
                        subject: "Book Return Reminder",
                        message: `Dear ${user.name}, <br/><br/>

                                    We hope you're doing well. This is a reminder that the book you borrowed is now overdue. Please return it as soon as possible to avoid any late fees.<br/><br/>

                                    If you have already returned the book, kindly ignore this message.<br/><br/>

                                    Thank you! <br/><br/>
                                    Bookworm Library Management`,
                    })
                    // Mark the borrow record as notified
                    element.notified = true
                    await element.save()
                    console.log(`Notification sent to ${user.email}`)
                }
            }
            
        } catch (error) {
            console.error("Some error is occured while notifying users:", error)
        }
    })

}