import React from 'react';
import { useMachine } from '@xstate/react';

import bookingMachine from '../machines/bookingMachine';
import {Nav} from '../components/Nav';
import { StepsLayout } from './StepsLayout';


import './css/BaseLayout.css';

export const BaseLayout = () => {

    const [state, send] = useMachine(bookingMachine);

    console.log('Maquinia inicializada',state.value, state.context)
    return (
        <div className='BaseLayout'>
           <Nav state={state} send={send}/>
           <StepsLayout state={state} send={send}/>
        </div>
    )
}