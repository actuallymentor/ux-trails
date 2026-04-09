// Import React and necessary styled-components
import React, { Suspense, lazy } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import styled, { css } from 'styled-components'
import { useUxSinsStore } from '../../stores/ux_sins_store'

// Lazy load ToastContainer and Slide
const LazyToastContainer = lazy( () => import( 'react-toastify' ).then( module => ( { default: module.ToastContainer } ) ) )
const Slide = lazy( () => import( 'react-toastify' ).then( module => ( { default: module.Slide } ) ) )

// When the centered_toast sin is active, position the toast container
// in the dead center of the viewport so it blocks content
const centered_styles = css`
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate( -50%, -50% ) !important;
    width: auto !important;
`

// Styled component
const StyledToast = styled( LazyToastContainer )`

    ${ ( { $centered } ) => $centered && centered_styles }

    .Toastify__toast {
        background: ${ ( { theme } ) => theme.colors.backdrop };
        color: ${ ( { theme } ) => theme.colors.text };
        box-shadow: ${ ( { theme } ) => theme.shadows[0] };
    }

    .Toastify__progress-bar {
        background: ${ ( { theme } ) => theme.colors.primary };
    }

    .Toastify__toast-icon svg {
        fill: ${ ( { theme } ) => theme.colors.accent };
    }

    .Toastify__close-button {
        color: ${ ( { theme } ) => theme.colors.text };
        align-self: center;
    }

`

// Component using Suspense for lazy loading
export default function Toast( props ) {

    const { enabled_sins } = useUxSinsStore()
    const centered = !!enabled_sins?.centered_toast

    // When the disable_toasts sin is active, render nothing — all toasts are silently swallowed
    if( enabled_sins?.disable_toasts ) return null

    return (
        <Suspense fallback={ null }>
            <StyledToast
                { ...props }
                $centered={ centered }
                position='top-center'
                autoClose={ 5000 }
                transition={ Slide }
            />
        </Suspense>
    )
}
