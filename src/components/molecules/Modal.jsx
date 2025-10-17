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

    return <Backdrop onClick={ onClose }>{ children }</Backdrop>

}