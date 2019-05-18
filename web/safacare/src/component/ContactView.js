import React from 'react';
import { main_color } from '../App';
import { stateManager, dataStore } from '../Controller';
import contact_png from '../static/联系我们.png'
import back from '../static/后退.png'
export default class ContactView extends React.Component{
    render(){
        const {width, height} = this.props
        return (
        <div style={{width: '100%', height: '100%'}}>
            <img src={back} style={{width: 10, left: 12, position: 'absolute', top: 20, }} alt=''
            onClick={()=> stateManager.active_view.set('状态')}/>
            <img src={contact_png} style={{width: width/2, left: width/4, position: 'absolute', top: 100}} alt=''/>
        </div>
        )
    }
}