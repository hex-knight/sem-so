import React from 'react'
import { Route } from 'react-router-dom'
import Tarea1 from '../../Tareas/Tarea 1/Tarea1'
import Tarea4 from '../../Tareas/Tarea 4/Tarea4'
import Tarea6 from '../../Tareas/Tarea 6/Tarea6'
import Tarea8 from '../../Tareas/Tarea 8/Tarea8'

export default function Router(props) {
    return (
        <div className="App-header">
            <Route exact path="/" render={()=>{window.location="/8"}} />
            <Route exact path="/2">
                <Tarea1 />
            </Route>
            <Route exact path="/4">
                <Tarea4 />
            </Route>
            <Route exact path="/6">
                <Tarea6 />
            </Route>
            <Route exact path="/8">
                <Tarea8 />
            </Route>
        </div>
    )
}
