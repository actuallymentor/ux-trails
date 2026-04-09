import { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import { XIcon, SendIcon } from "lucide-react"
import { useAppointmentsStore } from "../../stores/appointments"

// ─── Cancel flow steps ─────────────────────────────────────────
const STEPS = {
    select_appointment: 'select_appointment',
    ask_name: 'ask_name',
    ask_email: 'ask_email',
    ask_postcode: 'ask_postcode',
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


// ─── Component ──────────────────────────────────────────────────

export default function CancelChatbot( { on_close } ) {

    const [ messages, set_messages ] = useState( [] )
    const [ input, set_input ] = useState( '' )
    const [ step, set_step ] = useState( STEPS.select_appointment )
    const [ data, set_data ] = useState( {} )
    const scroll_ref = useRef( null )
    const input_ref = useRef( null )
    const { appointments, clear_appointment } = useAppointmentsStore()
    const started = useRef( false )

    // Build a lookup of "date time" strings to appointment indices
    const appointment_keys = appointments.map( ( appt, i ) => ( {
        key: appt.time ? `${ appt.date } ${ appt.time }` : appt.date,
        index: i,
    } ) )

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

        const appt_list = appointment_keys.map( ( { key } ) => key ).join( '\n' )

        set_messages( [
            { from: 'bot', text: 'I see that you want to cancel an appointment. Which appointment do you want to cancel?' },
            { from: 'bot', text: `Your appointments:\n${ appt_list }\n\nPlease type the date and time exactly as shown above.` },
        ] )
    }, [] )

    // Add a bot message
    const bot_say = text => {
        set_messages( prev => [ ...prev, { from: 'bot', text } ] )
    }

    // Core handler
    const handle_send = e => {
        e.preventDefault()
        const value = input.trim()
        if( !value ) return
        set_input( '' )

        // Echo the user's message
        set_messages( prev => [ ...prev, { from: 'user', text: value } ] )

        switch( step ) {

            case STEPS.select_appointment: {
                const match = appointment_keys.find( ( { key } ) => key === value )
                if( !match ) {
                    bot_say( `I don't understand "${ value }". Please type the date and time of the appointment exactly as listed.` )
                    break
                }
                set_data( prev => ( { ...prev, appointment_index: match.index, appointment_key: match.key } ) )
                set_step( STEPS.ask_name )
                bot_say( 'To proceed with the cancellation, what is your full name?' )
                break
            }

            case STEPS.ask_name:
                set_data( prev => ( { ...prev, name: value } ) )
                set_step( STEPS.ask_email )
                bot_say( `Thank you, ${ value }. What is your email address?` )
                break

            case STEPS.ask_email:
                set_data( prev => ( { ...prev, email: value } ) )
                set_step( STEPS.ask_postcode )
                bot_say( 'Got it. What is your postal code?' )
                break

            case STEPS.ask_postcode:
                set_data( prev => ( { ...prev, postcode: value } ) )
                set_step( STEPS.ask_reason )
                bot_say( 'What is the reason for cancelling your appointment?' )
                break

            case STEPS.ask_reason:
                set_data( prev => ( { ...prev, reason: value } ) )
                set_step( STEPS.confirm )
                bot_say( `Are you sure you want to cancel the appointment on ${ data.appointment_key }? Type "yes" or "no".` )
                break

            case STEPS.confirm: {
                if( value === 'yes' ) {
                    clear_appointment( data.appointment_index )
                    bot_say( 'Your appointment has been cancelled. You can close this chat now.' )
                    set_step( STEPS.done )
                } else if( value === 'no' ) {
                    bot_say( 'Cancellation aborted. You can close this chat.' )
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
            <span>Cancellation Assistant</span>
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
