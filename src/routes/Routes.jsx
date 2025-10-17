import { Route, Routes as DOMRoutes, useNavigate } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"
import Loading from "../components/molecules/Loading"
import Toast from "../components/molecules/ToastContainer"
import { prefetch } from 'less-lazy'

// Statically loaded pages
import Homepage from "../components/pages/Homepage"
import LoginPage from "../components/pages/Login"
import { useUserStore } from "../stores/user_store"
import { useLabTestScoreStore } from "../stores/labtest_score"

// Lazy loaded pages
const LabTests = lazy( prefetch( () => import( '../components/pages/LabTests' ) ) )
const Messages = lazy( prefetch( () => import( '../components/pages/Messages' ) ) )
const Documents = lazy( prefetch( () => import( '../components/pages/Documents' ) ) )

export default function Routes() {


    const { user } = useUserStore()
    const { init_dummy_scores } = useLabTestScoreStore()
    const navigate = useNavigate()
    const current_path = window.location.pathname
    const public_paths = [ '/', '/login' ]

    // Initialise stores
    useEffect( () => {
        init_dummy_scores()
    }, [] )

    // Redirects
    useEffect( () => {

        // If user is logged in, redirect away from login
        if( user && current_path === '/login'  ) navigate( '/' )

        // If user is not logged in, redirect to home page if they are on anything other than public_paths
        if( !user && !public_paths.includes( current_path ) ) navigate( '/' )
    }, [ user, navigate ] )
    
    return <Suspense fallback={ <Loading delay="500" message='Loading' /> }>

        <Toast />
        
        <DOMRoutes>

            <Route exact path='/' element={ <Homepage /> } />
            <Route exact path='/login' element={ <LoginPage /> } />

            <Route exact path='/profile/labs' element={ <LabTests /> } />
            <Route exact path='/profile/inbox' element={ <Messages /> } />
            <Route exact path='/profile/documents' element={ <Documents /> } />

        </DOMRoutes>

    </Suspense>
}