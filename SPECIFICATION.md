# UX Trails specification

A personal health record simulator designed to be used to do UX research. The app allows the researcher to toggle on and off UX "sins" for testing purposes.

## Personal health record (PHR) vs electronic health record (EHR)

A personal health record is a place where patients can view the data that healthcare providers generate. Examples of things one might find in a PHR:

- Medical imaging
- Blood test values
- Medication prescriptions
- Communications from healthcare providers

It is explicitly not a electronic health record, the difference between a PHR is who uses it and thus the priorities of the software. En EHR is meant for medical professionals, and thus is optimised for clinical priorities such as shared decision making. A PHR is designed for patients and is thus optimised to facilitate patient communication.

For that reason the UX and UI priorites of an EHR and PHR are fundamentally different.

## Functionality in this app

This PHR simulator will provide a simulated experience including the functionality below.

**Account management**

NOTE: all account data will be stored ephermally on the device itself, there is no hosted service managing user accounts.

- [ ] create an account
- [ ] log into an existing account
- [ ] delete current account

**Viewing data**

Data is generated randomly for each account. Data that will be visible:

- [ ] Blood tests
 - [ ] View lab notes
 - [ ] View the history of specific values
- [ ] Appointement planning
 - [ ] Make an appointment with a GP through an online booking system
- [ ] Messaging inbox (incoming messages)
  - [ ] View read and unread messages
  - [ ] Mark unread messages as read
- [ ] Patient file (documents)
  - [ ] Read documents

## Technology stack

This application is a webapp built using `vite` and `react.js`. It is a frontend-only application that will use browser available APIs and not rely on anything external.

The UX sins available to the app will be togglable through query parameters.
