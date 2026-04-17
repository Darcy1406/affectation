import { createBrowserRouter } from "react-router-dom"
import Home from "./Pages/Home"
import Algo from "./Pages/Algo"

export const router = createBrowserRouter([
    {
        index: true,
        element: <Home />
    },
    {
        path: '/affectation',
        element: <Algo />
    }
])