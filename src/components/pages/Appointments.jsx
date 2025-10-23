import { useState } from "react"
import Container from "../atoms/Container"
import { H2, Text } from "../atoms/Text"
import Modal from "../molecules/Modal"
import Button from "../atoms/Button"
import Card from "../atoms/Card"
import { useAppointmentsStore } from '../../stores/appointments'
import Input from "../molecules/Input"
import { log, truncate } from "mentie"
import Section from "../atoms/Section"

export default function Appointments() {

    const [ makenew, set_makenew ] = useState( false )
    const [ new_appointment, set_new_appointment ] = useState( { reason: '', date: '' } )
    const { appointments, add_appointment, get_slots_for_date } = useAppointmentsStore()
    const slots = get_slots_for_date( new_appointment.date )
    log.info( 'Available slots for date', new_appointment.date, slots )

    function save_appointment() {
        const { slot, reason } = new_appointment
        add_appointment( { ...slot, reason } )
        set_makenew( false )
        set_new_appointment( { reason: '', date: '' } )
    }

    return <Container $align='center' $justify='center'>

        <H2 $margin='2rem 0 1rem'>Uw Afspraken</H2>
        <Button onClick={ () => set_makenew( true ) }>Nieuwe Afspraak</Button>

        <Section $wrap='nowrap'>
            { appointments.map( ( { date, time, reason }, index ) => <Card key={ index } $margin='.5rem 0' >
                <Text>Datum: { date } om { time }</Text>
                <Text>Reden: { truncate( reason, 150 ) }</Text>
            </Card> ) }
            { appointments.length == 0 && <Text $margin='2rem 0'>U heeft nog geen afspraken gepland.</Text> }
        </Section>

        { makenew && <Modal onClose={ () => set_makenew( false ) }>
            <Card>
                <Input
                    label='Datum van Afspraak'
                    type='date'
                    value={ new_appointment.date }
                    onChange={ ( e ) => set_new_appointment( prev => ( { ...prev, date: e.target.value } ) ) }
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
                    value={ new_appointment.reason }
                    onChange={ ( e ) => set_new_appointment( prev => ( { ...prev, reason: e.target.value } ) ) }
                />
                <Button
                    $margin='1rem 0 0'
                    onClick={ save_appointment }
                    disabled={ !new_appointment.date || new_appointment.slot_index === undefined || !new_appointment.reason }
                >
                    Bevestig Afspraak
                </Button>
            </Card>
        </Modal> }

    </Container>

}