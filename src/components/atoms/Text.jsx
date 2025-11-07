import styled from 'styled-components'
import { passable_props } from '../component_base'

export const Text = styled.p`
	font-size: ${ ( { $size='1rem' } ) => $size };
	margin: 1rem 0;
	line-height: 1.5rem;
	color: ${ ( { theme, $color } ) => theme.colors[ $color ] || $color || theme.colors.text };
	text-align: ${ ( { $align } ) => $align || 'left' };
	overflow-wrap: anywhere;
	background: ${ ( { background='initial' } ) => background };
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	font-style: ${ ( { $style='normal' } ) => $style };
	white-space: pre-wrap;
	svg {
		margin-right: 0.5rem;
		vertical-align: middle;
		padding: 2px;
	}
	${ passable_props };
`


export const Span = styled.span`
	color: ${ ( { theme, $color = 'text' } ) => theme.colors[$color] || $color };
	font-weight: ${ ( { $weight = 'normal' } ) => $weight };
	font-style: ${ ( { $style = 'normal' } ) => $style };
	text-decoration: ${ ( { $decoration = 'none' } ) => $decoration };
`

export const H1 = styled.h1`
	font-size: 2.5rem;
	font-weight: 500;
	line-height: 1.2;
	font-family: Helvetica, sans-serif;
	text-align: ${ ( { $align } ) => $align || 'left' };
	color: ${ ( { theme, $color='primary' } ) => theme.colors[ $color ] || $color || theme.colors.text };
	overflow-wrap: anywhere;
	svg {
		margin-right: 0.5rem;
		vertical-align: vertical;
	}
	${ passable_props };
`

export const H2 = styled.h2`
	font-size: 1.5rem;
	margin: 0 0 1rem;
	line-height: 1.2;
	font-weight: 400;
	text-align: ${ ( { $align } ) => $align || 'left' };
	color: ${ ( { theme, $color='accent' } ) => theme.colors[ $color ] || $color || theme.colors.text };
	overflow-wrap: anywhere;
	svg {
		margin-right: 0.5rem;
		vertical-align: vertical;
	}
	${ passable_props };
`

export const Sidenote = styled.p`
	color: ${ ( { theme } ) => theme.colors.hint };
	font-style: italic;
	margin-top:  1rem;
	text-align: center;
	overflow-wrap: anywhere;
	${ passable_props };
`

export const Sup = styled.sup`
	overflow-wrap: anywhere;
`