import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useTheme } from 'styled-components'

export default ( { data, width=500, height=400, label_angle=30, ...props } ) => {

    const theme = useTheme()

    // Safety check
    if( !data || !data.readings || data.readings.length == 0 ) return null

    return  <LineChart
        width={ width }
        height={ height }
        data={ data.readings }
        margin={ {
            top: 50,
            bottom: 5,
            left: 0,
            right: 50
        } }
    >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" angle={ label_angle } tickMargin={ label_angle } tickSize={ 10 } height={ height / 5 } />
        <YAxis />
        <Tooltip contentStyle={ { background: theme.colors.backdrop } } labelStyle={ { color: theme.colors.primary, marginBottom: 10 } } />
        <Legend />
        <Line name={ `${ data.name } (${ data.unit })` } type="monotone" dataKey="value" stroke={ theme.colors.accent } />
    </LineChart>

}