import React from 'react';
import { main_color } from '../App';
import { stateManager, dataStore } from '../Controller';
import forword_icon from '../static/月份后退.png'
import back_icon from '../static/月份前进.png'
import data_week_png from '../static/周数据.png'
import data_month_png from '../static/月数据.png'
import sleep_in_day_png from '../static/时间条.png'
import sleep_in_month_png from '../static/月统计.png'

export default class DataView extends React.Component{
    constructor(){
        super()
        this.state = {
            mode: '周'
        }
    }

    render(){
        const {width, height} = this.props
        const {mode} = this.state
        const mode_width = 115, mode_height = 40, mode_fontSize = mode_height/2.5
        const d_inner_r = 0
        const day_width = 10

        var now_date = new Date();
        let year = now_date.getFullYear(),
            month = now_date.getMonth()+1,
            day = now_date.getDate()
        let time_str = mode==='周'?
            (year + '/' + month + '/' + (day -3) + '-' + (day + 4))
            :
            (year + '.' + month)
        const time_str_length = time_str.length
        return (
        <div style={{width: '100%', height: '100%'}}>
            {/* 调节周和月 */}
            <div style={{
                position:'absolute', borderRadius: 15,
                height: mode_height, width: mode_width, 
                top: 90, left: width/2-mode_width/2,
                boxShadow: '#d4d4d4 2px 3px 2px',
                fontSize: mode_fontSize}}
                onClick={()=>this.setState({mode: mode==='周'?'月':'周'})}>
                <div style={{
                    position:'absolute', borderRadius: 15,
                    height: mode_height-d_inner_r*2, width: mode_width/2-d_inner_r, 
                    top: d_inner_r, left: mode==='周'?d_inner_r:mode_width-d_inner_r-(mode_width/2-d_inner_r),
                    transition: '0.2s',
                    fontSize: mode_fontSize,
                    border: '3px solid #eee' }}
                />
                <div style={{
                    position: "absolute", 
                    bottom: mode_height/2-mode_fontSize/2, 
                    left:mode_width/4-mode_fontSize/2, 
                    textAlign:'center',
                    zIndex:30}}>
                    周
                </div>
                <div style={{
                    position: "absolute", 
                    bottom: mode_height/2-mode_fontSize/2, 
                    right:mode_width/4-mode_fontSize/2, 
                    textAlign:'center',
                    zIndex:30}}>
                    月
                </div>
            </div>
            {/* 选择时间 */}
            <div style={{position:'absolute',top:160, left:width/2}}>
                <img src={back_icon} style={{position:'absolute', right: 80, width: day_width}} alt=''/>
                <img src={forword_icon} style={{position:'absolute', left: 80, width: day_width}} alt=''/>
                <div style={{position:'absolute', fontSize: 13, textAlign:'center', width: 13*time_str_length, right: -6.5*time_str_length, top: -2}}>
                    {time_str}
                </div>
            </div>

            {/* 根据年月选择 */}
            {mode==='周' && <img src={data_week_png} style={{position:'absolute',bottom: 15, width: width/1.2, left: width/2-width/2.4, zIndex: 30}} alt=''></img>}
            {mode==='月' && <img src={data_month_png} style={{position:'absolute',top: 250, width: width/1.4, left: width/2-width/2.8, zIndex: 30}} alt=''></img>}

            {mode==='月' && <img src={sleep_in_month_png} style={{position:'absolute',bottom: 15, width: width/1.2, left: width/2-width/2.4, zIndex: 0}} alt=''></img>}
        </div>
        )
    }
}