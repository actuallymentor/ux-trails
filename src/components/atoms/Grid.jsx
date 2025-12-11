import { log } from "mentie"
import styled, { useTheme } from "styled-components"

const GridBase = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: ${ ( { $gap="1rem" } ) => $gap };
    justify-content: space-between;
    align-content: center;
    container-type: inline-size;

    > * {
        flex: 1 1 ${ ( { $basis='250px', $gap='1rem' } ) => `calc( ${ $basis } - ${ $gap } )` };
        max-width: ${ ( { $basis='250px', $gap='1rem' } ) => `calc( ${ $basis } - ${ $gap } )` };

        // If parent size is less than double basis, make items take full width
        @container ( max-width: ${ ( { $basis='250px', $gap='1rem' } ) => `calc((${ $basis } * 2 - ${ $gap }))` } ) {
            flex: 1 1 100%;
            max-width: 100%;
        }

    }
`

export default function Grid( { children, ...props } ) {

    const theme = useTheme()

    // If no basis prop was set, set it to half the theme level container size min gap
    const { $gap, $basis } = props
    if( !$gap ) {
        const gap = '1rem'
        log.info( 'Setting Grid gap to', gap )
        props.$gap = gap
    }
    if( !$basis ) {
        const basis = `${ theme?.container / 2 }px`
        log.info( 'Setting Grid basis to', basis )
        props.$basis = basis
    }
    return (
        <GridBase { ...props } >
            { children }
        </GridBase>
    )
}