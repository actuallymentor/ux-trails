import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWidth } from '../../hooks/window'
import Link from '../atoms/Link'
import { useUserStore } from '../../stores/user_store'
import { CalendarIcon, FileTextIcon, HomeIcon, LogInIcon, LogOutIcon, MailIcon, MenuIcon, TestTubesIcon, UserIcon, XIcon } from 'lucide-react'
import { useLabTestScoreStore } from '../../stores/labtest_score'
import { useAppointmentsStore } from '../../stores/appointments'
import { log } from 'mentie'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageDropdown'
import { useUxSinsStore } from '../../stores/ux_sins_store'

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

	background: ${ ( { theme } ) => theme.colors.backdrop };
	box-shadow: ${ ( { theme } ) => `${ theme.shadows[0] }` };


	.menu_burger {
		/* margin: 0 ${ ( { $mobile_open } ) => $mobile_open ? '100px' : '0' } 0 0 20px; */

		&.open {
			position: absolute;
		}
		&.close {
			position: relative;
			top: 0px;
		}

		top: 0px;
		left: ${ ( { $float } ) => $float === 'left' ? '5px' : 'auto' };
		right: ${ ( { $float } ) => $float === 'right' ? '10px' : 'auto' };
		padding: 10px 10px 10px 0;
		cursor: pointer;
	}

	.menu_links.fullscreen {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: ${ ( { theme } ) => `${ theme.container }px` };
		margin: 0 auto;
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

	// Style the links inside the menu
	& a {

		display: inline-block;

		padding: 1rem;
		margin: 0;
		color: ${ ( { $mobile_open, theme } ) => $mobile_open ? theme.colors.primary : '' };
		width: ${ ( { $mobile_open } ) => $mobile_open ? '100%' : 'auto' };

		svg {
			vertical-align: middle;
			margin-right: 8px;
			stroke: ${ ( { theme } ) => theme.colors.accent };
		}

	}


`

export default function Menu( { $menu_height, $float='center', ...props } ) {

    const [ open, set_open ] = useState( false )
    const { user, clear_user } = useUserStore()
    const { clear_labs } = useLabTestScoreStore()
    const { clear_appointments } = useAppointmentsStore()
    const { enabled_sins } = useUxSinsStore()
    const force_hamburger = !!enabled_sins?.forced_small_hamburger
    const width = useWidth()
    const menu_cutoff = 1000
    const use_burger = force_hamburger || width < menu_cutoff
    $float = force_hamburger ? 'right' : ( use_burger ? 'left' : $float )
    const burger_icon_size = force_hamburger ? '32' : '50'
    const { t, i18n } = useTranslation()

    useEffect( () => {
        if( !use_burger ) set_open( false )
    }, [ width ] )

    // Full logout function
    const logout = () => {
        clear_user()
        clear_labs()
        clear_appointments()
        log.info( 'User logged out' )
    }

    // Make list of link components
    const icon_size = '1rem'
    const logged_in_links = [
        <Link key='bloodtest' $align={ use_burger ? 'left' : 'center' } navigate='/profile/labs'><TestTubesIcon size={ icon_size } />{ t( 'menu.labs' ) }</Link>,
        <Link key='appointments' $align={ use_burger ? 'left' : 'center' } navigate='/profile/appointments'><CalendarIcon size={ icon_size } />{ t( 'menu.appointments' ) }</Link>,
        <Link key='inbox' $align={ use_burger ? 'left' : 'center' } navigate='/profile/inbox'><MailIcon size={ icon_size } />{ t( 'menu.messages' ) }</Link>,
        <Link key='documenten' $align={ use_burger ? 'left' : 'center' } navigate='/profile/documents'><FileTextIcon size={ icon_size } />{ t( 'menu.documents' ) }</Link>,
        <Link key='settings' $align={ use_burger ? 'left' : 'center' } navigate='/profile/settings'><UserIcon size={ icon_size } />{ t( 'menu.settings' ) }</Link>,
        <Link key="logout" $align={ use_burger ? 'left' : 'center' } onClick={ logout }><LogOutIcon size={ icon_size } />{ t( 'menu.logout' ) }</Link>
    ]
    const links = [
        <Link key="home" $align={ use_burger ? 'left' : 'center' } navigate='/'><HomeIcon size={ icon_size } />{ t( 'menu.home' ) }</Link>,
        !user && !use_burger && <span key="nav-spacer" style={ { flex: 1 } } />,
        !user && <Link key="login" $align={ use_burger ? 'left' : 'center' } navigate='/login'><LogInIcon size={ icon_size } />{ t( 'menu.login' ) }</Link>,
        user && logged_in_links,
    ].filter( Boolean ).flat()


    

    return <MenuBase $menu_height={ $menu_height } $float={ $float } $mobile_open={ open }>

        { use_burger && !open && <MenuIcon size={ burger_icon_size } className='menu_burger open' $mobile_open={ open } onClick={ f => set_open( !open ) } /> }

        { /* Always render burger menu container for animation, but conditionally render fullscreen */ }
        { use_burger && <span className='menu_links burger'>
            <XIcon size={ burger_icon_size } className='menu_burger close' $mobile_open={ open } onClick={ f => set_open( !open ) } />
            { links }
            <LanguageSelector />
        </span> }
        
        { !use_burger && <span className='menu_links fullscreen'>
            { links }
            <LanguageSelector />
        </span> }

    </MenuBase>

}