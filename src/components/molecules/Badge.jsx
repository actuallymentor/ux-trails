import styled from "styled-components"
import { passable_props } from "../component_base"

const BadgeContainer = styled.span`
    background: ${ ( { theme, $background='accent' } ) => theme.colors[ $background ] || $background  || theme.colors.accent };
    border-radius: 12px;
    position: ${ ( { $position='absolute' } ) => $position };
    right: ${ ( { $right='0' } ) => $right };
    top: ${ ( { $top='0' } ) => $top };
    padding: 0.25rem 0.75rem;
    color: ${ ( { theme } ) => theme.colors.backdrop };
    font-size: 0.75rem;
    font-weight: bold;
    ${ passable_props }
`

export default function Badge( { children, ...props } ) {
    
    return <BadgeContainer { ...props } >
        { children }
    </BadgeContainer>

}