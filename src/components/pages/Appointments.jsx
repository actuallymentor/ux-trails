import { useEffect, useState } from "react"
import Container from "../atoms/Container"
import { H1, H2, Text } from "../atoms/Text"
import Modal from "../molecules/Modal"
import Button from "../atoms/Button"
import Card from "../atoms/Card"
import { useAppointmentsStore } from '../../stores/appointments'
import Input from "../molecules/Input"
import { log, truncate } from "mentie"
import { CalendarIcon, ClockIcon, HospitalIcon, MapPinIcon, NotebookIcon, PencilIcon, XIcon } from "lucide-react"
import Column from "../atoms/Column"
import { toast } from "react-toastify"
import { date_after_timestamp_validator, date_to_locale_string, is_future, today_yyyy_mm_dd } from "../../modules/dates"
import Badge from "../molecules/Badge"
import Section from "../atoms/Section"
import Grid from "../atoms/Grid"
import { useTranslation } from "react-i18next"
import { useUxSinsStore } from "../../stores/ux_sins_store"

export default function Appointments() {

    const [ makenew, set_makenew ] = useState( false )
    const [ new_appointment, set_new_appointment ] = useState( { reason: '', date: '' } )
    const [ view_appointment, set_view_appointment ] = useState( null )
    const { appointments, add_appointment, get_slots_for_date, clear_appointment } = useAppointmentsStore()
    const slots = get_slots_for_date( new_appointment.date )
    const { t } = useTranslation()
    const { enabled_sins } = useUxSinsStore()
    const ApptIcon = enabled_sins?.ambiguous_icons ? HospitalIcon : CalendarIcon
    log.info( 'Available slots for date', new_appointment.date, slots )

    function save_appointment() {

        const { slot, reason, date } = new_appointment
        log.info( 'Saving new appointment with data:', new_appointment )

        // Validate date is today or in the future (mobile browsers may bypass the min attribute)
        if( !date || !is_future( date ) ) return toast.error( t( 'appointments.toast.invalidDate' ) )

        // Validate a time slot was selected
        if( !slot?.time ) return toast.error( t( 'appointments.toast.missingSlot' ) )

        // Validate the combined date+time is still in the future (guards against stale selections)
        const appointment_time = new Date( `${ date }T${ slot.time }:00` )
        if( Number.isNaN( appointment_time.getTime() ) || appointment_time.getTime() <= Date.now() ) return toast.error( t( 'appointments.toast.invalidDate' ) )

        // Validate reason was provided and meets minimum length
        if( !reason || reason.length < 10 ) return toast.error( t( 'appointments.toast.missingReason' ) )

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
        const confirmation_key = time ? 'appointments.toast.cancelConfirmWithTime' : 'appointments.toast.cancelConfirm'
        const confirmed = confirm( t( confirmation_key, { date, time } ) )
        if( confirmed ) {
            clear_appointment( index )
            toast.success( t( 'appointments.toast.cancelSuccess' ) )
        }
        if( !confirmed ) toast.info( t( 'appointments.toast.cancelAbort' ) )
    }

    return <Container $align='center' $justify='center'>

        <Column $direction='row' $justify='space-between' $width='100%' $align='center' $margin='0 0 2rem' >
            <H1 $margin='0'><ApptIcon size='2.2rem' />{ t( 'appointments.pageTitle' ) }</H1>
            <Button onClick={ () => set_makenew( true ) }>{ t( 'appointments.new' ) }</Button>
        </Column>

        <Section $width='1600px' $align='center' $justify='center' $padding='0' $margin='0' >
            <Grid>
                { appointments.map( ( { date, time, reason }, index ) => {

                    const future = is_future( date )

                    return <Card key={ index } $margin='.5rem 0' $padding='2rem 3rem' $justify='flex-start' $flex='1 0 500px'>
                
                        <H2 $margin='0 0 1rem'>{ t( 'appointments.cardTitle' ) }</H2>
                        <Badge $background={ future ? 'accent' : 'hint' } $margin='2rem'>{ future ? t( 'appointments.badgeUpcoming' ) : t( 'appointments.badgePast' ) }</Badge>

                        <Column $direction='row' $align='center' $justify='flex-start' $padding='0' $gap='1rem' >
                            { date && <Text $margin='.1rem 0' $color='hint'><ApptIcon />{ date_to_locale_string( date ) }</Text> }
                            { time && <Text $margin='.1rem 0' $color='hint'><ClockIcon />{ time }</Text> }
                        </Column>
                        <Text $color='hint' $margin='.1rem 0'><MapPinIcon />{ appointments[ index ]?.location || t( 'appointments.defaultLocation' ) }</Text>
                        { reason && <Text $color='hint' $margin='0'><PencilIcon />{ truncate( reason, 40 ) }</Text> }
                
                        <Column $direction='row' $align='center' $justify='flex-start' $padding='0' $gap='0rem' >
                            <Button $scale='.9' $variant='outline' $margin='1rem 0 0' onClick={ () => set_view_appointment( appointments[ index ] ) }>{ t( 'appointments.viewDetails' ) }</Button>  
                            <Button $scale='.9' $variant='outline' $margin='1rem 0 0' onClick={ () => cancel_appointment( index ) }>{ t( 'appointments.cancel' ) }</Button>
                        </Column>
                    </Card>
            
                } ) }
                { appointments.length == 0 && <Text $margin='2rem 0'>{ t( 'appointments.emptyState' ) }</Text> }
            </Grid>
        </Section>

        { view_appointment && <Modal onClose={ () => set_view_appointment( null ) }>
            <Card>
                <button
                    type="button"
                    data-testid="close-view-appointment-modal"
                    onClick={ () => set_view_appointment( null ) }
                    aria-label={ t( 'common.close' ) }
                    style={ { position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', background: 'none', border: 'none', padding: 0 } }
                >
                    <XIcon size={ 20 } />
                </button>
                <H2>{ t( 'appointments.detailsTitle' ) }</H2>
                { view_appointment?.date && <Text><ApptIcon />{ view_appointment?.date }</Text> }
                { view_appointment?.time && <Text><ClockIcon />{ view_appointment?.time }</Text> }
                { view_appointment?.location && <Text><MapPinIcon />{ view_appointment?.location }</Text> }
                { view_appointment?.reason && <Text><NotebookIcon />{ view_appointment?.reason }</Text> }
                <Button $margin='1rem 0 0' onClick={ () => set_view_appointment( null ) }>{ t( 'common.close' ) }</Button>
            </Card>
        </Modal> }

        { makenew && <Modal onClose={ () => set_makenew( false ) }>
            <Card>
                <button
                    type="button"
                    data-testid="close-new-appointment-modal"
                    onClick={ () => set_makenew( false ) }
                    aria-label={ t( 'common.close' ) }
                    style={ { position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', background: 'none', border: 'none', padding: 0 } }
                >
                    <XIcon size={ 20 } />
                </button>
                <Input
                    label={ t( 'appointments.form.dateLabel' ) }
                    type='date'
                    value={ new_appointment.date }
                    validate={ date_after_timestamp_validator }
                    error={ t( 'appointments.form.dateError' ) }
                    min={ today_yyyy_mm_dd }
                    onChange={ ( e ) => set_new_appointment( prev => ( { ...prev, date: e.target.value, slot: null, slot_index: null } ) ) }
                />
                { new_appointment.date && <>
                    <Text $margin='1rem 0 0.5rem'>{ t( 'appointments.selectTime' ) }</Text>
                    { slots.map( ( slot, slot_index ) => {
                        return <Button key={ slot_index } $variant={ slot_index == new_appointment.slot_index ? 'solid' : 'outline' } $margin='.1rem .3rem'  onClick={ () => set_new_appointment( prev => ( { ...prev, slot, slot_index } ) ) }>{ slot.time }</Button>
                    } ) }
                    { slots.length == 0 && <Text>{ t( 'appointments.noSlots' ) }</Text> }
                </> }
                <Input
                    label={ t( 'appointments.form.reasonLabel' ) }
                    placeholder={ t( 'appointments.form.reasonPlaceholder' ) }
                    type='textarea'
                    validate={ value => value?.length >= 10 }
                    error={ t( 'appointments.form.reasonError' ) }
                    value={ new_appointment.reason }
                    onChange={ ( e ) => set_new_appointment( prev => ( { ...prev, reason: e.target.value } ) ) }
                />
                <Button
                    $margin='1rem 0 0'
                    onClick={ save_appointment }
                    disabled={ !new_appointment.date || !date_after_timestamp_validator( new_appointment.date ) || new_appointment.slot_index == null || !new_appointment.reason || new_appointment.reason.length < 10 }
                >
                    { t( 'appointments.form.confirm' ) }
                </Button>
            </Card>
        </Modal> }

    </Container>

}