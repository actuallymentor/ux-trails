import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import Theme from './components/atoms/Theme'
import Routes from './routes/Routes'
import Toast from './components/molecules/ToastContainer'
import HelpButton from './components/molecules/HelpButton'
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

// When the "small text" sin is active, set root font size to 10px.
// Most components use rem units, so targeting html scales everything.
const SmallTextStyle = createGlobalStyle`
    html {
        font-size: 10px !important;
    }
`

// When the "buttons as text" sin is active, strip all button styling.
// Buttons become indistinguishable from body text, only underlined on hover.
const ButtonsAsTextStyle = createGlobalStyle`
    [data-ux-button] {
        background: none !important;
        border: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        color: ${ ( { theme } ) => theme.colors.text } !important;
        font-size: inherit !important;
        text-decoration: none !important;
        display: inline !important;
    }
    [data-ux-button]:hover {
        text-decoration: underline !important;
    }
    [data-ux-button][disabled] {
        opacity: 0.5 !important;
        text-decoration: none !important;
    }
`

// ///////////////////////////////
// Render component
// ///////////////////////////////
export default function App( ) {

    // Wipe all persisted data when ?wipe_data=true is present
    useEffect( () => {
        const params = new URLSearchParams( window.location.search )
        if( params.get( 'wipe_data' ) === 'true' ) {
            localStorage.clear()
            window.location.replace( window.location.origin + window.location.pathname )
        }
    }, [] )

    const { enabled_sins } = useUxSinsStore()
    const no_icons = !!enabled_sins?.no_icons
    const buttons_as_text = !!enabled_sins?.buttons_as_text
    const small_text = !!enabled_sins?.small_text

    return <Router>
        <QueryParamProvider adapter={ ReactRouter6Adapter }>
            <Theme>
                { no_icons && <NoIconsStyle /> }
                { buttons_as_text && <ButtonsAsTextStyle /> }
                { small_text && <SmallTextStyle /> }
                <Toast />
                <HelpButton />
                <Routes />
            </Theme>
        </QueryParamProvider>
    </Router>


}