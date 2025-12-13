import styled from 'styled-components'
import Link from '../atoms/Link'
import { useTranslation } from 'react-i18next'

const FooterBase = styled.nav`
	flex-wrap: wrap;
	flex: 0 1;
	width: 100%;
	padding: 1rem 0;
	text-align: center;
	display: flex;
	margin-top: auto;
	
	flex-direction: row;
	align-items: center;
	justify-content: center;

	& a {
		padding: 0 1rem;
		opacity: .5;

	}

`

export default function Footer( { ...props } ) {
	const { t } = useTranslation()
    return <FooterBase { ...props }>
	
		<Link href='https://github.com/actuallymentor' target='_blank'>{ t( 'footer.copyright' ) }</Link>

    </FooterBase>
}