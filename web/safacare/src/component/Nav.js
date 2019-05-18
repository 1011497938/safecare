import React from 'react';
import { main_color, empty_color } from '../App';
import { autorun } from 'mobx';
import { stateManager, dataStore } from '../Controller';
import info_icon from '../static/顶部导航-更多.png'
import app_icon from '../static/logo抠图.png'
// import { Button } from 'semantic-ui-react';

export default class Nav extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            active_view: 'home',
        }
    }
    componentDidMount(){
        this.onActiveViewChange = autorun(()=>{
            const active_view = stateManager.active_view.get()
            console.log('切换到',active_view)
            this.setState({active_view: active_view})
        })
    }
 
    render(){
        const {width, height} = this.props
        const {active_view} = this.state

        const item_width = width/10,
              item_height = height/10,
              icon_width = item_width/1.5,
              text_style = {bottom: 6, left: 8, position: 'absolute'}
        const index2postion = index=>{
            const center = width/2
            const num = 5
            const d_x = width/num
            return center - (3-index)*d_x - d_x/4
        }
        const name2border = name=>{
            return '4px solid ' +  (active_view===name?main_color:empty_color)
        }
        return (
        <div style={{width: '100%', height: item_height, fontSize: 10, fontWeight: 'bolder', textAlign: 'center'}}>
            <div 
                onClick={()=> stateManager.active_view.set('更多')} 
                style={{top: 0, left: index2postion(1),
                borderBottom: '4px solid ' +  empty_color, 
                width: item_width, height: item_height, position:'absolute', }}>
                <img alt='' src={info_icon} style={{width: icon_width, bottom: 14, left: item_width/2-icon_width/2, position: 'absolute'}}/>
            </div>
            <div 
                onClick={()=> stateManager.active_view.set('状态')} 
                style={{top: 0, left: index2postion(2),
                borderBottom: name2border('状态'), 
                width: item_width, height: item_height, position:'absolute', }}>
                <div style={text_style}>状态</div>
            </div>
            <div 
                onClick={()=> stateManager.active_view.set('数据')} 
                style={{top: 0, left: index2postion(3),
                borderBottom: name2border('数据'), 
                width: item_width, height: item_height, position:'absolute', }}>
                <div style={text_style}>数据</div>
            </div>
            <div 
                onClick={()=> stateManager.active_view.set('定位')} 
                style={{top: 0, left: index2postion(4),
                borderBottom: name2border('定位'), 
                width: item_width, height: item_height, position:'absolute', }}>
                <div style={text_style}>定位</div>
            </div>
            <div
                onClick={()=> stateManager.active_view.set('联系')}  
                style={{top: 0, left: index2postion(5),
                borderBottom: '4px solid ' +  empty_color, 
                width: item_width, height: item_height, position:'absolute', }}>
                <img alt='' src={app_icon} style={{width: icon_width, bottom: 4, left: item_width/2-icon_width/2, position: 'absolute'}}/>
            </div>
        </div>
        )
    }
}