import styled from 'styled-components'
import { passable_props } from '../component_base'
import { useLocation, useNavigate } from 'react-router-dom'

const AWrap = styled.a`
    display: inline;
	color: ${ ( { $color='primary', $highlight, theme } ) => $highlight ? theme.colors.backdrop :  theme.colors[ $color ] || $color  } !important;
	font-size: 1rem;
	text-decoration: underline;
	text-align: ${ ( { $align='center' } ) => $align };
	background: ${ ( { $highlight, theme } ) => $highlight ? theme.colors.accent : 'transparent' };
	&:hover {
		cursor: pointer;
	}
	&[disabled] {
		opacity: 0.5;
	}
	svg {
		stroke: ${ ( { $color='primary', $highlight, theme } ) => $highlight ? theme.colors.backdrop :  theme.colors[ $color ] || $color  }!important;
	}
	${ passable_props };
`

export default function A( { href, navigate, new_tab=false, ...props } ) {

    const navigate_to = useNavigate()
    const { pathname } = useLocation()
    const current = pathname ==  navigate


    function handle_navigate() {
        if( navigate ) navigate_to( navigate )
        if( href && new_tab ) window.open( href, '_blank' ).focus()
        if( href && !new_tab ) window.open( href, '_self' )
    }

    return <AWrap $highlight={ current } onClick={ handle_navigate } { ...props }/>

}