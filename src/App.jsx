import { BrowserRouter as Router } from 'react-router-dom'
import Theme from './components/atoms/Theme'
import Routes from './routes/Routes'
import Toast from './components/molecules/ToastContainer'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

// ///////////////////////////////
// Render component
// ///////////////////////////////
export default function App( ) {

    return <Theme>

        <Toast />

        <Router>

            <QueryParamProvider adapter={ ReactRouter6Adapter }>
                <Routes />
            </QueryParamProvider>

        </Router>

    </Theme>

}