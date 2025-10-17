import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWidth } from '../../hooks/window'
import Link from '../atoms/Link'
import { useUserStore } from '../../stores/user_store'
import { CalendarIcon, DropletIcon, FileArchive, HomeIcon, InboxIcon, KeyIcon, LogOutIcon, MenuIcon, XIcon } from 'lucide-react'
import { useLabTestScoreStore } from '../../stores/labtest_score'

const MenuBase = styled.nav`

	position: fixed;
	padding-left: inherit;
    padding-right: inherit;

	z-index: 99;
	top: 0;
	left: 0;
	width: 100%;
	height: ${ ( { $menu_height='55px' } ) => $menu_height };
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
	align-self: flex-start;

	background: ${ ( { $mobile_open, theme } ) => theme.colors.backdrop };
	box-shadow: ${ ( { $mobile_open, theme } ) => $mobile_open && `${ theme.shadows[2] }` };


	.menu_burger {
		/* margin: 0 ${ ( { $mobile_open } ) => $mobile_open ? '100px' : '0' } 0 0 20px; */

		&.open {
			position: absolute;
		}
		&.close {
			position: relative;
			top: 10px;
		}

		top: 10px;
		left: ${ ( { $float } ) => $float === 'left' ? '10px' : 'auto' };
		right: ${ ( { $float } ) => $float === 'right' ? '10px' : 'auto' };
		padding: 10px;
		cursor: pointer;
	}

	.menu_links.fullscreen {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: ${ ( { $float } ) => $float === 'left' ? 'flex-start' : 'flex-end' };
		width: 100%;
	}

	.menu_links.burger {
		position: fixed;
		top: 0;
		left: ${ ( { $float } ) => $float === 'left' ? '0' : 'auto' };
		right: ${ ( { $float } ) => $float === 'right' ? '0' : 'auto' };
		height: 100vh;
		min-width: 300px;
		background: ${ ( { theme } ) => theme.colors.backdrop };
		box-shadow: ${ ( { theme } ) => theme.shadows[2] };
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: ${ ( { $float } ) => $float === 'left' ? 'flex-start' : 'flex-end' };
		
		/* Slide-in animation */
		transform: translateX(${ ( { $float, $mobile_open } ) => {
        if( !$mobile_open ) {
            return $float === 'left' ? '-100%' : '100%'
        }
        return '0'
    } });
		transition: transform 0.3s ease-in-out;
		
		/* Ensure it starts off-screen when closed */
		${ ( { $mobile_open } ) => !$mobile_open ? 'pointer-events: none;' : '' }
		
		/* Animate menu items with stagger effect */
		& a {
			opacity: ${ ( { $mobile_open } ) => $mobile_open ? '1' : '0' };
			transform: translateY(${ ( { $mobile_open } ) => $mobile_open ? '0' : '20px' });
			transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
			transition-delay: ${ ( { $mobile_open } ) => $mobile_open ? '0.2s' : '0s' };
		}
		
		& a:nth-child(2) { transition-delay: ${ ( { $mobile_open } ) => $mobile_open ? '0.25s' : '0s' }; }
		& a:nth-child(3) { transition-delay: ${ ( { $mobile_open } ) => $mobile_open ? '0.3s' : '0s' }; }
		& a:nth-child(4) { transition-delay: ${ ( { $mobile_open } ) => $mobile_open ? '0.35s' : '0s' }; }
	}

	& a {

		display: inline-block;

		/* &:not(:first-child) {
			width: ${ ( { $mobile_open } ) => $mobile_open ? '100%' : '' };
			border-bottom: 1px solid ${ ( { theme, $mobile_open } ) => $mobile_open ? theme.colors.primary : 'rgba( 0,0,0,0 )' };
			margin: 1rem .5rem 0;
			padding: 0 0 1rem;
		} */
		padding: 1rem;
		margin: 0;
		color: ${ ( { $mobile_open, theme } ) => $mobile_open ? theme.colors.primary : '' };

		svg {
			vertical-align: middle;
			margin-right: 8px;
			stroke: ${ ( { theme } ) => theme.colors.accent };
		}

	}

`

export default function Menu( { $menu_height, $float='left', ...props } ) {

    const [ open, set_open ] = useState( false )
    const { user, clear_user } = useUserStore()
    const { clear_labs } = useLabTestScoreStore()
    const width = useWidth()
    const menu_cutoff = 600
    const use_burger = width < menu_cutoff

    useEffect( () => {
        if( !use_burger ) set_open( false )
    }, [ width ] )

    // Full logout function
    const logout = () => {
        clear_user()
        clear_labs()
    }

    // Make list of link components
    const icon_size = '1rem'
    const logged_in_links = [
        <Link key='bloodtest' navigate='/profile/labs'><DropletIcon size={ icon_size } />Uitslagen</Link>,
        <Link key='appointments' navigate='/profile/appointments'><CalendarIcon size={ icon_size } />Afspraken</Link>,
        <Link key='inbox' navigate='/profile/inbox'><InboxIcon size={ icon_size } />Berichten</Link>,
        <Link key='documenten' navigate='/profile/documents'><FileArchive size={ icon_size } />Documenten</Link>,
        <Link key="logout" onClick={ logout }><LogOutIcon size={ icon_size } />Uitloggen</Link>
    ]
    const links = [
        <Link key="home" navigate='/'><HomeIcon size={ icon_size } />Startpagina</Link>,
        !user && <Link key="login" navigate='/login'><KeyIcon size={ icon_size } />Inloggen</Link>,
        user && logged_in_links,
    ].filter( Boolean ).flat()

    return <MenuBase $menu_height={ $menu_height } $float={ $float } $mobile_open={ open }>

        { use_burger && !open && <MenuIcon size='50' className='menu_burger open' $mobile_open={ open } onClick={ f => set_open( !open ) } /> }
        
        { /* Always render burger menu container for animation, but conditionally render fullscreen */ }
        { use_burger && <span className='menu_links burger'>
            <XIcon size='50' className='menu_burger close' $mobile_open={ open } onClick={ f => set_open( !open ) } />
            { links }
        </span> }
        
        { !use_burger && <span className='menu_links fullscreen'>
            { links }
        </span> }

    </MenuBase>

}