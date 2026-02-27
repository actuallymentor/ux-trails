import styled from 'styled-components'
import { passable_props } from '../component_base'
import Menu from '../molecules/Menu'
import Footer from '../molecules/Footer'

const ContainerBase = styled.div`
	position: relative;
	overflow: hidden;
	background: ${ ( { theme } ) => theme.colors.backdrop };
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 100vh;
	width: ${ ( { theme } ) => `${ theme.container }px` };
	max-width: 100%;
	margin: 0 auto;
	box-sizing: border-box;
	padding-top: ${ ( { $menu=true, $menu_height='55px' } ) => $menu ? $menu_height : '0' };

	main {

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		flex: 1;
		min-height: 100%;
		max-width: 100%;
		width: 100%;

		// When body is under theme.container size add padding
		@media ( max-width: ${ ( { theme } ) => `${ theme.container + 40 }px` } ) {
			padding: 0 2rem;
		}

		// Implement generic passable props
		${ passable_props };

	}

	// Implement generic passable props
	${ passable_props };

	& * {
		box-sizing: border-box;
		max-width: 100%;
	}
`

export default function Container( { menu_height='55px', menu=true, $footer=true, children, ...props } ) {

    return <ContainerBase { ...props } $footer={ $footer } $menu_height={ menu_height }>

        { menu && <Menu $menu_height={ menu_height } /> }

        <main>
            { children }
        </main>

        { $footer && <Footer /> }


    </ContainerBase>
}