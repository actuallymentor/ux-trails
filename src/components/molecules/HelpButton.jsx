import { useState } from "react"
import styled from "styled-components"
import { HelpCircleIcon, XIcon, PhoneIcon, MailIcon, MegaphoneIcon, DrumIcon, UmbrellaIcon } from "lucide-react"
import Modal from "./Modal"
import { useUxSinsStore } from "../../stores/ux_sins_store"

// ─── Floating button ───────────────────────────────────────────

const FloatingBtn = styled.button`
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    background: ${ ( { theme } ) => theme.colors.accent };
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba( 0, 0, 0, 0.25 );
    z-index: 900;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        transform: scale( 1.08 );
        box-shadow: 0 6px 20px rgba( 0, 0, 0, 0.3 );
    }
`

// ─── Modal card ────────────────────────────────────────────────

const HelpCard = styled.div`
    background: ${ ( { theme } ) => theme.colors.backdrop };
    border-radius: 12px;
    padding: 2.5rem 3rem;
    width: 420px;
    max-width: calc( 100vw - 2rem );
    box-shadow: 0 12px 40px rgba( 0, 0, 0, 0.2 );
    position: relative;
`

const CloseBtn = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    color: ${ ( { theme } ) => theme.colors.hint };
    padding: 0.2rem;

    &:hover { color: ${ ( { theme } ) => theme.colors.text }; }
`

const Title = styled.h2`
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: ${ ( { theme } ) => theme.colors.text };
`

const Subtitle = styled.p`
    font-size: 0.9rem;
    color: ${ ( { theme } ) => theme.colors.hint };
    margin: 0 0 1.8rem;
`

const ContactRow = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1rem;
    margin: 0.5rem 0;
    border-radius: 8px;
    background: ${ ( { theme } ) => theme.colors.backdrop };

    svg {
        color: ${ ( { theme } ) => theme.colors.accent };
        flex-shrink: 0;
    }
`

const ContactLabel = styled.span`
    font-size: 0.8rem;
    color: ${ ( { theme } ) => theme.colors.hint };
    display: block;
`

const ContactValue = styled.span`
    font-size: 0.95rem;
    font-weight: 500;
    color: ${ ( { theme } ) => theme.colors.text };
    display: block;
`

// ─── Random contact details ────────────────────────────────────

const phone_numbers = [
    '+31 20 555 0142',
    '+31 10 444 0283',
    '+31 30 666 0371',
    '+31 70 777 0459',
    '+31 40 888 0567',
]

const email_addresses = [
    'support@medportal.example.nl',
    'helpdesk@zorgcentrum.example.nl',
    'contact@patientcare.example.nl',
    'info@healthdesk.example.nl',
    'assist@kliniek.example.nl',
]

function random_pick( arr ) {
    return arr[ Math.floor( Math.random() * arr.length ) ]
}


// ─── Component ─────────────────────────────────────────────────

export default function HelpButton() {

    const { enabled_sins } = useUxSinsStore()
    const broken = !!enabled_sins?.broken_help_button
    const ambiguous = !!enabled_sins?.ambiguous_icons
    const HelpIcon = ambiguous ? MegaphoneIcon : HelpCircleIcon
    const PhIcon = ambiguous ? DrumIcon : PhoneIcon
    const EmIcon = ambiguous ? UmbrellaIcon : MailIcon
    const [ open, set_open ] = useState( false )
    const [ contact ] = useState( () => ( {
        phone: random_pick( phone_numbers ),
        email: random_pick( email_addresses ),
    } ) )

    return <>

        <FloatingBtn onClick={ () => { if( !broken ) set_open( true ) } } aria-label="Help">
            <HelpIcon size={ 26 } />
        </FloatingBtn>

        { open && <Modal onClose={ () => set_open( false ) }>
            <HelpCard>

                <CloseBtn onClick={ () => set_open( false ) } aria-label="Close">
                    <XIcon size={ 20 } />
                </CloseBtn>

                <Title>Need help?</Title>
                <Subtitle>If you need help, you can reach us at:</Subtitle>

                <ContactRow>
                    <PhIcon size={ 22 } />
                    <div>
                        <ContactLabel>Phone</ContactLabel>
                        <ContactValue>{ contact.phone }</ContactValue>
                    </div>
                </ContactRow>

                <ContactRow>
                    <EmIcon size={ 22 } />
                    <div>
                        <ContactLabel>Email</ContactLabel>
                        <ContactValue>{ contact.email }</ContactValue>
                    </div>
                </ContactRow>

            </HelpCard>
        </Modal> }

    </>

}
