import {createBrowserRouter, Navigate} from "react-router"
import Login from "./features/auth/pages/login"
import Register from "./features/auth/pages/register" 
import Protected from "./features/auth/components/protected"  
import GuestOnly from "./features/auth/components/guestOnly"
import Landing from "./features/interview/pages/landing"
import Home from "./features/interview/pages/home"    
import Interview from "./features/interview/pages/interview"

export const router =  createBrowserRouter([
    {
        path: "/login",
        element: <GuestOnly><Login /></GuestOnly>
    },
    {
        path: "/register",
        element: <GuestOnly><Register /></GuestOnly>
    },
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/landing",
        element: <Landing />
    },
    {
        path: "/home",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/dashboard",
        element: <Protected><Navigate to="/interview" replace /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
])
