import { useEffect, useState } from "react"
import Container from "../atoms/Container"
import { H1, H2, Text } from "../atoms/Text"
import Modal from "../molecules/Modal"
import Button from "../atoms/Button"
import Card from "../atoms/Card"
import { useAppointmentsStore } from '../../stores/appointments'
import Input from "../molecules/Input"
import { log, truncate } from "mentie"
import { CalendarIcon, ClockIcon, MapPinIcon, NotebookIcon, PencilIcon } from "lucide-react"
import Column from "../atoms/Column"
import { toast } from "react-toastify"
import { date_after_timestamp_validator, date_to_locale_string, is_future, tomorrow_yyyy_mm_dd } from "../../modules/dates"
import Grid from "../atoms/Grid"
import Badge from "../molecules/Badge"

export default function Appointments() {

    const [ makenew, set_makenew ] = useState( false )
    const [ new_appointment, set_new_appointment ] = useState( { reason: '', date: '' } )
    const [ view_appointment, set_view_appointment ] = useState( null )
    const { appointments, add_appointment, get_slots_for_date, clear_appointment } = useAppointmentsStore()
    const slots = get_slots_for_date( new_appointment.date )
    log.info( 'Available slots for date', new_appointment.date, slots )

    function save_appointment() {

        const { slot, reason } = new_appointment
        const { date, time, available } = slot
        const ms_to_appointment = new Date( `${ date }T${ time }:00` ).getTime() - Date.now()
        log.info( 'Saving new appointment with data:', new_appointment, { ms_to_appointment } )

        // Validations
        if( !`${ reason }`.length ) return toast.error( 'Vul alstublieft een reden in.' )
        if( ms_to_appointment < 0 ) return toast.error( 'Selecteer alstublieft een geldige datum.' )
        if( !slot?.time ) return toast.error( 'Selecteer alstublieft een tijdslot.' )

        log.info( 'Saving appointment:', { ...slot, reason } )

        add_appointment( { ...slot, reason } )
        set_makenew( false )
        set_new_appointment( { reason: '', date: '' } )
    }


    useEffect( () => {
        log.info( 'Appointment updated:', new_appointment )
    }, [ new_appointment ] )

    function cancel_appointment( index ) {
        log.info( 'Cancel appointment at index', index )
        const { date, time } = appointments[ index ]
        const confirmed = confirm( `Weet u zeker dat u uw afspraak op ${ date } ${ time ? `om ${ time }` : '' } wilt annuleren?` )
        if( confirmed ) {
            clear_appointment( index )
            toast.success( 'Afspraak succesvol geannuleerd.' )
        }
        if( !confirmed ) toast.info( 'Afspraak niet geannuleerd.' )
    }

    return <Container $align='center' $justify='center'>

        <Column $direction='row' $justify='space-between' $width='100%' $align='center' $margin='0 0 2rem' >
            <H1 $margin='0'><CalendarIcon size='2.2rem' />Uw Afspraken</H1>
            <Button onClick={ () => set_makenew( true ) }>Nieuwe Afspraak</Button>
        </Column>

        <Grid>
            { appointments.map( ( { date, time, reason }, index ) => {

                const future = is_future( date )

                return <Card key={ index } $min-width='500px' $width='calc( 33.333% - calc( 2rem / 3 ) )' $margin='.5rem 0' $padding='2rem 3rem' $justify='flex-start' >
                
                    <H2 $margin='0'>Afspraak</H2>
                    <Badge $background={ future ? 'accent' : 'hint' } $margin='2rem'>{ future ? 'Aankomend' : 'Verleden' }</Badge>

                    <Column $direction='row' $align='center' $justify='flex-start' $padding='0' $gap='1rem' >
                        { date && <Text $color='hint'><CalendarIcon />{ date_to_locale_string( date ) }</Text> }
                        { time && <Text $color='hint'><ClockIcon />{ time }</Text> }
                    </Column>
                    <Text $color='hint' $margin='0 0 1rem'><MapPinIcon />{ appointments[ index ]?.location || 'In de praktijk' }</Text>
                    { reason && <Text $color='hint' $margin='0'><PencilIcon />{ truncate( reason, 40 ) }</Text> }
                
                    <Column $direction='row' $align='center' $justify='flex-start' $padding='0' $gap='1rem' >
                        <Button $variant='outline' $margin='2rem 0 0' onClick={ () => set_view_appointment( appointments[ index ] ) }>Bekijk Details</Button>  
                        <Button $variant='outline' $margin='2rem 0 0' onClick={ () => cancel_appointment( index ) }>Afspraak Annuleren</Button>
                    </Column>
                </Card>
            
            } ) }
            { appointments.length == 0 && <Text $margin='2rem 0'>U heeft nog geen afspraken gepland.</Text> }
        </Grid>

        { view_appointment && <Modal onClose={ () => set_view_appointment( null ) }>
            <Card>
                <H2>Afspraak Details</H2>
                { view_appointment?.date && <Text><CalendarIcon />{ view_appointment?.date }</Text> }
                { view_appointment?.time && <Text><ClockIcon />{ view_appointment?.time }</Text> }
                { view_appointment?.location && <Text><MapPinIcon />{ view_appointment?.location }</Text> }
                { view_appointment?.reason && <Text><NotebookIcon />{ view_appointment?.reason }</Text> }
                <Button $margin='1rem 0 0' onClick={ () => set_view_appointment( null ) }>Sluit</Button>
            </Card>
        </Modal> }

        { makenew && <Modal onClose={ () => set_makenew( false ) }>
            <Card>
                <Input
                    label='Datum van Afspraak'
                    type='date'
                    value={ new_appointment.date }
                    validate={ date_after_timestamp_validator }
                    error="Kies een datum in de toekomst."
                    min={ tomorrow_yyyy_mm_dd }
                    onChange={ ( e ) => set_new_appointment( prev => ( { ...prev, date: e.target.value, slot: null, slot_index: null } ) ) }
                />
                { new_appointment.date && <>
                    <Text $margin='1rem 0 0.5rem'>Selecteer een beschikbare tijd:</Text>
                    { slots.map( ( slot, slot_index ) => {
                        return <Button key={ slot_index } $variant={ slot_index == new_appointment.slot_index ? 'solid' : 'outline' } $margin='.1rem .3rem'  onClick={ () => set_new_appointment( prev => ( { ...prev, slot, slot_index } ) ) }>{ slot.time }</Button>
                    } ) }
                    { slots.length == 0 && <Text>Geen beschikbare tijdsloten op deze datum.</Text> }
                </> }
                <Input
                    label='Reden van Afspraak'
                    placeholder='Bijv. "Routine Controle"'
                    type='textarea'
                    validate={ value => value?.length >= 10 }
                    error="Vul alstublieft een geldige reden in (minimaal 10 tekens)."
                    value={ new_appointment.reason }
                    onChange={ ( e ) => set_new_appointment( prev => ( { ...prev, reason: e.target.value } ) ) }
                />
                <Button
                    $margin='1rem 0 0'
                    onClick={ save_appointment }
                    disabled={ !new_appointment.date || new_appointment.slot_index == null || !new_appointment.reason }
                >
                    Bevestig Afspraak
                </Button>
            </Card>
        </Modal> }

    </Container>

}