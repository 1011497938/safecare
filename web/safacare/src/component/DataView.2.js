import React from 'react';
import { main_color } from '../App';
import { stateManager, dataStore } from '../Controller';

export default class DataView extends React.Component{
    render(){
        const {width, height} = this.props
        return (
        <div style={{width: '100%', height: '100%'}}>

        </div>
        )
    }
}