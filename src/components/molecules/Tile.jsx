import styled from "styled-components"
import Card from "../atoms/Card"
import { H2, Text } from "../atoms/Text"
import { passable_props } from "../component_base"

const TileContainer = styled( Card )`
    cursor: pointer;
    background: ${ ( { $color='accent', theme } ) => theme.colors[ $color ] || $color || theme.colors.accent };
    h2, p, svg {
        color: ${ ( { theme } ) => theme.colors.backdrop };
    }
    text-align: center;
    ${ passable_props }
`

export default function Tile( { icon: Icon, title, text, onClick } ) {
    return <TileContainer $display='flex' $direction='column' $padding="2rem" $margin="1rem" $width='250px' $justify="center" $align="center" onClick={ onClick }>
        <Icon size="2rem" />
        <H2 $margin="1rem 0 .5rem">{ title }</H2>
        <Text $align='center'>{ text }</Text>
    </TileContainer>
}