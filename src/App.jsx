import { BrowserRouter as Router } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import Theme from './components/atoms/Theme'
import Routes from './routes/Routes'
import Toast from './components/molecules/ToastContainer'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { useUxSinsStore } from './stores/ux_sins_store'

// When the "no icons" sin is active, hide all informative SVG icons.
// Functional icons (hamburger, modal close, password toggle) are preserved.
const NoIconsStyle = createGlobalStyle`
    svg {
        display: none !important;
    }

    /* Preserve functional icons and charts */
    svg.menu_burger,
    button svg,
    .password_visibility svg,
    .recharts-wrapper svg {
        display: inline !important;
    }
`

// ///////////////////////////////
// Render component
// ///////////////////////////////
export default function App( ) {

    const { enabled_sins } = useUxSinsStore()
    const no_icons = !!enabled_sins?.no_icons

    return <Router>
        <QueryParamProvider adapter={ ReactRouter6Adapter }>
            <Theme>
                { no_icons && <NoIconsStyle /> }
                <Toast />
                <Routes />
            </Theme>
        </QueryParamProvider>
    </Router>


}