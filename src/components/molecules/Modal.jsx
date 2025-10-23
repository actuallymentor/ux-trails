import { log } from "mentie"
import styled from "styled-components"

const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

export default function Modal( { children, onClose } ) {

    const handle_close = ( event ) => {
        // Only trigger close when the backdrop itself (not its children) is clicked
        if( event.target !== event.currentTarget ) return

        log.info( 'Modal backdrop clicked:', event.target )
        if( onClose ) onClose()
    }

    return <Backdrop onClick={ handle_close }>{ children }</Backdrop>

}