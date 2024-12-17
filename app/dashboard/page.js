import { getAuth } from "firebase/auth"
import { app } from "../firebase"
import { Heading } from "@chakra-ui/react"

const Dashboard = () => {
    const auth = getAuth(app)
    const user = auth.currentUser

    if (user !== null) {
        console.log(user.uid)
    } else {
        console.log("No active user")
    }
}

export default Dashboard
