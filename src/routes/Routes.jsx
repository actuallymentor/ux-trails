import { Route, Routes as DOMRoutes, useNavigate } from "react-router-dom"
import { Suspense, useEffect } from "react"
import Loading from "../components/molecules/Loading"
import Toast from "../components/molecules/ToastContainer"

// Statically loaded pages
import Homepage from "../components/pages/Homepage"
import LoginPage from "../components/pages/Login"
import { useUserStore } from "../stores/user_store"

// Lazy loaded pages
// const Homepage = lazy( () => import( '../components/pages/Homepage' ) )

export default function Routes() {


    const { user } = useUserStore()
    const navigate = useNavigate()
    const current_path = window.location.pathname

    // Redirects
    useEffect( () => {

        // If user is logged in, redirect away from login
        if( user && current_path === '/login'  ) navigate( '/' )

    }, [ user, navigate ] )
    
    return <Suspense fallback={ <Loading delay="500" message='Loading' /> }>

        <Toast />
        
        <DOMRoutes>

            <Route exact path='/' element={ <Homepage /> } />
            <Route exact path='/login' element={ <LoginPage /> } />

        </DOMRoutes>

    </Suspense>
}