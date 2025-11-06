import { log } from "mentie"
import { useEffect, useState } from "react"

export const useWidth = (  ) => {

    const [ width, setWidth ] = useState( window.innerWidth )

    // Keep track of window width
    useEffect( () => {
        const handleWindowResize = () => setWidth( window.innerWidth )
        window.addEventListener( 'resize', handleWindowResize )

        return () => window.removeEventListener( 'resize', handleWindowResize )
    }, [] )

    return width

}

export const useElementSize = ( element ) => {

    const [ size, setSize ] = useState( {} )

    // Keep track of window width
    useEffect( () => {

        const handleWindowResize = () => {

            if( !element ) return log.info( 'No element to measure size for yet' )
            const { clientWidth, scrollWidth, offsetWidth, clientHeight, scrollHeight, offsetHeight } = element 
            const width_overflow = scrollWidth > clientWidth
            const height_overflow = scrollHeight > clientHeight
            setSize( { clientWidth, scrollWidth, offsetWidth, clientHeight, scrollHeight, offsetHeight, width_overflow, height_overflow } )
        }
        handleWindowResize()
        
        window.addEventListener( 'resize', handleWindowResize )

        return () => window.removeEventListener( 'resize', handleWindowResize )
    }, [ element ] )

    return size

}