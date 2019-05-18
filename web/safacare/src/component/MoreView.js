import React from 'react';
import { main_color } from '../App';
import { stateManager, dataStore } from '../Controller';
import more_png from '../static/更多.png'
import back from '../static/后退.png'
export default class MoreView extends React.Component{
    render(){
        const {width, height} = this.props
        return (
        <div style={{width: '100%', height: '100%'}}>
            <img src={back} style={{width: 10, left: 12, position: 'absolute', top: 20, }} alt=''
            onClick={()=> stateManager.active_view.set('状态')}/>
            <img src={back} style={{zIndex: 30,width: 8, left: width/4+width*0.43, position: 'absolute', top: 100+width*0.81, transform:'scaleX(-1)'}} alt=''
            onClick={()=> stateManager.active_view.set('联系')}/>
            <img src={more_png} style={{width: width/2, left: width/4, position: 'absolute', top: 100, zIndex:0}} alt=''/>
        </div>
        )
    }
}