import React from 'react';
import { main_color } from '../App';
import { stateManager, dataStore } from '../Controller';
import ceshui_icon from '../static/侧睡.png'
import yangwo_icon from '../static/仰卧.png'
import xingle_icon from '../static/醒了.png'
import * as d3 from 'd3'
import { autorun } from 'mobx';
import cos_dist from 'compute-cosine-distance'
export default class StateView extends React.Component{
    constructor(){
        super()
        this.state = {
            mode: '仰卧',
            time: 100,
        }
        this.data = []
    }

    getTotalA(a){
        return  Math.sqrt(a.reduce((total, elm)=> total+elm*elm, 0))
    }

    isQuetA(a){
        // console.log(data.w, this.getTotalA(data.w))
        const ratio = this.getTotalA(a)/this.getTotalA(dataStore.start_a)
        return ratio<1.05 && ratio>0.95
    }



    detectWake(device_data){
        const {mode} = this.state
        const num = device_data.length
        if(num===0)
            return
        const last_time = device_data[num-1].time
        device_data = device_data.filter(elm=> {
            return last_time-elm.time<8000 //&& !
        })   //现在取得10秒
        let move_num = 0
        device_data.forEach(elm=>{
            move_num += this.isQuetA(elm.a)?0:1
        })
        if(device_data.length===0){
            return
        }
        let move_ratio = move_num/device_data.length
        // console.log(move_ratio, move_num, device_data.length)
        if(move_ratio>0.05){
            if(mode!=='醒'){
                this.setState({mode: '醒'})
                stateManager.notify_wake.set(!stateManager.notify_wake.get())
            }
        }else if(move_ratio<0.02){
            if(mode==='醒'){
                this.setState({mode: '仰卧'})
            }
        }
    }
    detectCeWo(device_data){
        const {mode} = this.state
        if(mode==='醒')
            return

        const {start_a} = dataStore
        const num = device_data.length
        if(num===0)
            return
        const last_time = device_data[num-1].time, last_a = device_data[num-1].a
        device_data = device_data.filter(elm=> {
            return last_time-elm.time<6000 && this.isQuetA(elm.a)
        })   //现在取得10秒
        if(device_data.length===0){
            return
        }
        let cewo_po = 0
        device_data.forEach(elm => {
            if(cos_dist(elm.a, start_a)>0.15){
                cewo_po++
            }
        });
        cewo_po /= device_data.length
        // console.log(cewo_po)
        // console.log(cos_dist(last_a, start_a), start_a, last_a)  ||cos>0.2
        // let cos = cos_dist(last_a, start_a)
        if (cewo_po>0.6) {
            if(mode!=='侧卧'){
                this.setState({mode: '侧卧'})
                // console.log(stateManager.notify_cewo)
                stateManager.notify_cewo.set(!stateManager.notify_cewo.get())
            }
        }else{
            if(mode!=='仰卧')
                this.setState({mode: '仰卧'})
        }
    }


    componentDidMount(){
        const component = this
        document.onkeydown=function(event){ 
            var keyNum = window.event ? event.keyCode :event.which; 
            // 37,38,39
            let {mode} = component.state
            if(keyNum===37){
                mode = mode==='侧卧'?'仰卧':'侧卧'
                if(mode==='侧卧')
                    stateManager.notify_cewo.set(!stateManager.notify_cewo.get())
                component.setState({mode: mode})
            }else if(keyNum===39){
                mode = mode==='醒'?'仰卧':'醒'
                if(mode==='醒')
                    stateManager.notify_wake.set(!stateManager.notify_wake.get())
                component.setState({mode: mode})
            }
            // if( event.ctrlKey && keyNum == 13){  
            //     console.log("你按下了Ctrl + Enter")
            // } 
        };
        this.drawQuantityMotion()
        this.onDeviceDataChange = autorun(()=>{
            let device_data = dataStore.device_data.slice()
            this.detectCeWo(device_data)
            this.detectWake(device_data)
            // 画线
            const num = device_data.length
            const selected_num = num>100?100:num
            device_data = device_data.slice(num-selected_num,num-1)
            const data = device_data.map(elm=>{
                const {time} = elm
                const total_a = this.getTotalA(elm.a)-this.getTotalA(dataStore.start_a)
                // console.log(total_a)
                return [elm.time, total_a]
            })
            // console.log(data.length)
            this.data = data
            this.drawQuantityMotion()
            // console.log(device_data)
        })
    }

    drawQuantityMotion(){
        const {quantity_motion} = this.refs
        const width = this.props.width, height = this.props.height/4
        let {data} = this
        const {mode} = this.state

        // data = data.sort((a,b)=> a[0] - b[0])
        // console.log(quantity_motion)
    
        const path = d3.select(quantity_motion)
        const xs = data.map(elm=> elm[0]), ys = data.map(elm=> elm[1])
        const xScale = d3.scaleLinear().domain([Math.min(...xs), Math.max(...xs)]).range([width/10, width*0.9])
        const yScale = d3.scaleLinear().domain([-2,2]).range([height*0.9, height/10])
        // [Math.min(...ys), Math.max(...ys)]
        const normalLineGen  = d3.line()
                                .x(d=> xScale(d[0]))
                                .y(d=> yScale(d[1]))

                                .curve(d3.curveBasis)

        // console.log(data, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys))
        path
        .transition() // 启动过渡效果
        .duration(50)
        .attr('d', normalLineGen(data))
        .attr("stroke", d=>{
            return mode==='醒'? "#EC6740" : '#a0d0ea'
        })
        .attr("stroke-width", 4)
        .attr('fill', 'none')

    }
    render(){
        const {width, height} = this.props
        const {mode, time} = this.state
        const is_wake = mode==='醒'
        const mode2png = {
            '醒': xingle_icon,
            '侧卧': ceshui_icon,
            '仰卧': yangwo_icon
        }
        // console.log(mode)
        return (
        <div style={{width: '100%', height: '100%'}}>
            <div style={{top: 200, width: width, height: 50, position: 'absolute'}}>
                <div style={{textAlign: 'right', top: 0, position: 'absolute', right: '15%', fontSize: 20, color: main_color, fontWeight: 'bold'}}>
                    {is_wake?  '醒了':  mode}
                    <div style={{textAlign: 'right', right: 0,top: 40, width: 200,position: 'absolute', fontSize: 15, color: 'black', fontWeight: 200}}>
                        {Math.floor(time/60) + '小时' + time%60 + '分钟'}
                    </div>
                </div>
                <img src={xingle_icon} style={{display: mode==='醒'?'block':'none',width: '32%', left: '13%', top: '-70px',position:'absolute'}} alt=''/>
                <img src={ceshui_icon} style={{display: mode==='侧卧'?'block':'none',width: '32%', left: '13%', top: '-70px',position:'absolute'}} alt=''/>
                <img src={yangwo_icon} style={{display: mode==='仰卧'?'block':'none',width: '32%', left: '13%', top: '-70px',position:'absolute'}} alt=''/>
            </div>
            <div style={{bottom: height/5, width: '100%', height: 50, position: 'absolute'}}>
                <div style={{textAlign: 'right', right: '15%',top: -50, width: 200,position: 'absolute', fontSize: 10, color: 'black', fontWeight: 200}}>
                    运动量
                </div>
                <svg ref='sleep_monitor' width={width} height={height/5}>
                    <path ref='quantity_motion'/>
                </svg>
            </div>
        </div>
        )
    }
}