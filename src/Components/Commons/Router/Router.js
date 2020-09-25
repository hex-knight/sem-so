import React from 'react'
import { Route } from 'react-router-dom'
import Tarea1 from '../../Tareas/Tarea 1/Tarea1'

export default function Router(props) {
    return (
        <div className="App-header">
            <Route exact path="/" render={()=>{window.location="/2"}} />
            <Route exact path="/2">
                <Tarea1 />
            </Route>
        </div>
    )
}
