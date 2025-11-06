import styled from "styled-components"
import { passable_props } from "../component_base"

const ColumnBase = styled.div`
    display: grid;
    grid-template-columns: repeat( ${ ( { $columns='auto-fit' } ) => $columns }, ${ ( { $minmax } ) => $minmax ? `minmax( ${ $minmax } )` : '' } );
    gap: ${ ( { $gap='15px' } ) => $gap };
    ${ passable_props };
    
    & * {
        max-width: calc(100vw - 1rem);
    }
`

export default function Grid( { children, ...props } ) {

    return <ColumnBase { ...props }>
        { children }
    </ColumnBase>
}