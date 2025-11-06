import styled from "styled-components"
import { passable_props } from "../component_base"

const ColumnBase = styled.div`
    display: grid;
    grid-template-columns: repeat( ${ ( { $columns=2 } ) => $columns }, 1fr );
    gap: ${ ( { $gap='1rem' } ) => $gap };
    ${ passable_props };
`

export default function Grid( { children, ...props } ) {

    return <ColumnBase { ...props }>
        { children }
    </ColumnBase>
}