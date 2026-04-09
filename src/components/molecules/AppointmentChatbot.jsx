import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { XIcon, SendIcon } from "lucide-react"
import { useAppointmentsStore } from "../../stores/appointments"
import { useUxSinsStore } from "../../stores/ux_sins_store"
import { local_date_string } from "../../modules/dates"

// ─── Chat flow steps ───────────────────────────────────────────
// The bot walks the user through a rigid sequence of questions.
// Each step collects one piece of data before advancing.
const STEPS = {
    greeting: 'greeting',
    ask_name: 'ask_name',
    ask_email: 'ask_email',
    ask_postcode: 'ask_postcode',
    ask_phone: 'ask_phone',
    ask_date: 'ask_date',
    ask_time: 'ask_time',
    ask_reason: 'ask_reason',
    confirm: 'confirm',
    done: 'done',
}

// ─── Styled components ─────────────────────────────────────────

const ChatWindow = styled.div`
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 380px;
    max-width: calc( 100vw - 2rem );
    height: 520px;
    max-height: calc( 100vh - 3rem );
    border-radius: 12px;
    background: ${ ( { theme } ) => theme.colors.card };
    border: 1px solid ${ ( { theme } ) => theme.colors.borders };
    box-shadow: 0 8px 30px rgba( 0, 0, 0, 0.18 );
    display: flex;
    flex-direction: column;
    z-index: 1000;
    overflow: hidden;
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: ${ ( { theme } ) => theme.colors.accent };
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
`

const CloseBtn = styled.button`
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    padding: 0.2rem;

    &:hover { opacity: 0.8; }
`

const Messages = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`

const Bubble = styled.div`
    max-width: 85%;
    padding: 0.6rem 0.9rem;
    border-radius: 12px;
    font-size: 0.85rem;
    line-height: 1.4;
    white-space: pre-wrap;
    align-self: ${ ( { $from } ) => $from === 'bot' ? 'flex-start' : 'flex-end' };
    background: ${ ( { $from, theme } ) => $from === 'bot' ? theme.colors.backdrop : theme.colors.accent };
    color: ${ ( { $from, theme } ) => $from === 'bot' ? theme.colors.text : 'white' };
`

const InputRow = styled.form`
    display: flex;
    border-top: 1px solid ${ ( { theme } ) => theme.colors.borders };
    padding: 0.5rem;
    gap: 0.5rem;
`

const ChatInput = styled.input`
    flex: 1;
    border: 1px solid ${ ( { theme } ) => theme.colors.borders };
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
    outline: none;
    background: ${ ( { theme } ) => theme.colors.card };
    color: ${ ( { theme } ) => theme.colors.text };

    &:focus { border-color: ${ ( { theme } ) => theme.colors.accent }; }
`

const SendBtn = styled.button`
    background: ${ ( { theme } ) => theme.colors.accent };
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover { opacity: 0.85; }
`

// ─── Helpers ────────────────────────────────────────────────────

// Generate the next 5 weekdays as YYYY-MM-DD strings
function next_weekdays( count = 5 ) {
    const dates = []
    const d = new Date()
    d.setDate( d.getDate() + 1 ) // start from tomorrow
    while( dates.length < count ) {
        const dow = d.getDay()
        if( dow !== 0 && dow !== 6 ) dates.push( local_date_string( d ) )
        d.setDate( d.getDate() + 1 )
    }
    return dates
}


// ─── Component ──────────────────────────────────────────────────

export default function AppointmentChatbot( { on_close } ) {

    const [ messages, set_messages ] = useState( [] )
    const [ input, set_input ] = useState( '' )
    const [ step, set_step ] = useState( STEPS.ask_name )
    const [ data, set_data ] = useState( {} )
    const [ available_dates ] = useState( () => next_weekdays( 5 ) )
    const [ available_times, set_available_times ] = useState( [] )
    const scroll_ref = useRef( null )
    const input_ref = useRef( null )
    const { get_slots_for_date, add_appointment } = useAppointmentsStore()
    const { enabled_sins } = useUxSinsStore()
    const navigate = useNavigate()
    const redirect_home = !!enabled_sins?.appointment_redirect_home
    const started = useRef( false )

    // Auto-scroll to bottom when messages change
    useEffect( () => {
        if( scroll_ref.current ) scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight
    }, [ messages ] )

    // Focus input when step changes
    useEffect( () => {
        if( input_ref.current ) input_ref.current.focus()
    }, [ step ] )

    // Send greeting on mount
    useEffect( () => {
        if( started.current ) return
        started.current = true
        set_messages( [
            { from: 'bot', text: 'Hello! I\'m the appointment assistant. I\'ll help you book an appointment.' },
            { from: 'bot', text: 'To get started, what is your full name?' },
        ] )
    }, [] )

    // Add a bot message with a small visual delay
    const bot_say = text => {
        set_messages( prev => [ ...prev, { from: 'bot', text } ] )
    }

    // Core handler — very literal matching, no fuzzy logic
    const handle_send = e => {
        e.preventDefault()
        const value = input.trim()
        if( !value ) return
        set_input( '' )

        // Echo the user's message
        set_messages( prev => [ ...prev, { from: 'user', text: value } ] )

        // Process based on current step
        switch( step ) {

            case STEPS.ask_name:
                set_data( prev => ( { ...prev, name: value } ) )
                set_step( STEPS.ask_email )
                bot_say( `Thanks, ${ value }. What is your email address?` )
                break

            case STEPS.ask_email:
                set_data( prev => ( { ...prev, email: value } ) )
                set_step( STEPS.ask_postcode )
                bot_say( 'Got it. What is your postal code?' )
                break

            case STEPS.ask_postcode:
                set_data( prev => ( { ...prev, postcode: value } ) )
                set_step( STEPS.ask_phone )
                bot_say( 'Thank you. What is your telephone number?' )
                break

            case STEPS.ask_phone: {
                set_data( prev => ( { ...prev, phone: value } ) )
                set_step( STEPS.ask_date )
                const date_list = available_dates.join( '\n' )
                bot_say( `Great. On which date would you like your appointment?\n\nAvailable dates:\n${ date_list }\n\nPlease type the date exactly as shown above.` )
                break
            }

            case STEPS.ask_date: {

                // Exact match only — no fuzzy parsing
                if( !available_dates.includes( value ) ) {
                    bot_say( `I don't understand "${ value }". Please type one of the available dates exactly as listed.` )
                    break
                }

                set_data( prev => ( { ...prev, date: value } ) )

                // Fetch time slots for the chosen date
                const slots = get_slots_for_date( value )
                if( slots.length === 0 ) {
                    bot_say( `Sorry, there are no available time slots on ${ value }. Please pick another date.` )
                    break
                }

                const times = slots.map( s => s.time )
                set_available_times( times )
                set_step( STEPS.ask_time )
                const time_list = times.join( '\n' )
                bot_say( `Available times on ${ value }:\n${ time_list }\n\nPlease type the time exactly as shown above.` )
                break
            }

            case STEPS.ask_time: {

                if( !available_times.includes( value ) ) {
                    bot_say( `I don't understand "${ value }". Please type one of the available times exactly as listed.` )
                    break
                }

                set_data( prev => ( { ...prev, time: value } ) )
                set_step( STEPS.ask_reason )
                bot_say( 'What is the reason for your appointment? Please type it below.' )
                break
            }

            case STEPS.ask_reason: {
                set_data( prev => {
                    const updated = { ...prev, reason: value }

                    // Show confirmation summary
                    const summary = [
                        `Here is a summary of your appointment:`,
                        ``,
                        `Name: ${ updated.name }`,
                        `Email: ${ updated.email }`,
                        `Postal code: ${ updated.postcode }`,
                        `Phone: ${ updated.phone }`,
                        `Date: ${ updated.date }`,
                        `Time: ${ updated.time }`,
                        `Reason: ${ updated.reason }`,
                        ``,
                        `Do you want to confirm? Type "yes" or "no".`,
                    ].join( '\n' )

                    // Use setTimeout to ensure state is flushed before bot message
                    setTimeout( () => bot_say( summary ), 50 )

                    return updated
                } )
                set_step( STEPS.confirm )
                break
            }

            case STEPS.confirm: {

                if( value === 'yes' ) {

                    // Find the matching slot object from the store
                    const slots = get_slots_for_date( data.date )
                    const slot = slots.find( s => s.time === data.time )

                    if( slot ) {
                        add_appointment( { ...slot, reason: data.reason } )
                        bot_say( 'Your appointment has been created successfully! You can close this chat now.' )
                        set_step( STEPS.done )

                        // When the sin is active, redirect to home instead of staying on appointments
                        if( redirect_home ) { on_close(); navigate( '/' ) }
                    } else {
                        bot_say( 'Something went wrong — that time slot is no longer available. Please try again.' )
                        set_step( STEPS.done )
                    }

                } else if( value === 'no' ) {
                    bot_say( 'Appointment cancelled. You can close this chat or start over.' )
                    set_step( STEPS.done )
                } else {
                    bot_say( `I don't understand "${ value }". Please type "yes" or "no".` )
                }
                break
            }

            case STEPS.done:
                bot_say( 'This conversation is over. Please close the chat to start a new one.' )
                break
        }
    }

    // Render the chat window
    return <ChatWindow>

        <Header>
            <span>Appointment Assistant</span>
            <CloseBtn onClick={ on_close }><XIcon size={ 18 } /></CloseBtn>
        </Header>

        <Messages ref={ scroll_ref }>
            { messages.map( ( msg, i ) => <Bubble key={ i } $from={ msg.from }>{ msg.text }</Bubble> ) }
        </Messages>

        { step !== STEPS.done && <InputRow onSubmit={ handle_send }>
            <ChatInput
                ref={ input_ref }
                value={ input }
                onChange={ e => set_input( e.target.value ) }
                placeholder="Type your response..."
            />
            <SendBtn type="submit"><SendIcon size={ 16 } /></SendBtn>
        </InputRow> }

    </ChatWindow>

}
