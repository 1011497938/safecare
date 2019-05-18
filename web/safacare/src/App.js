import React from 'react';
import * as $ from 'jquery'
import 'semantic-ui-css/semantic.min.css'
import Nav from './component/Nav'
import { autorun } from 'mobx';
import { stateManager, dataStore } from './Controller';
import MapView from './component/MapView';
import DataView from './component/DataView'
import StateView from './component/StateView'
import ContactView from './component/ContactView';
import MoreView from './component/MoreView';
import notify_wake_png from './static/系统提示.png'
import notify_cewo_png from './static/侧卧提示.png'

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      active_view: 'home',
      width: $(window).width(),
      height: $(window).height(),
      notify_wake: false,
      notify_cewo: false
    }
  }
  componentDidMount(){
    this.onActiveViewChange = autorun(()=>{
      // console.log(stateManager)
      const active_view = stateManager.active_view.get()
      this.setState({active_view: active_view})
    })
    this.onWake = autorun(()=>{
      const notify_wake = stateManager.notify_wake.get()
      if(!this.init1){
        this.init1 = true
        return        
      }
      // 开始显示
      this.setState({notify_wake: true})
      setTimeout(()=>{
        // console.log('消失')
        const {notify_wake} = this.state
        if(notify_wake)
          this.setState({notify_wake: false})
      },3000)
    })
    this.onCewo = autorun(()=>{
      const notify_cewo = stateManager.notify_cewo.get()
      if(!this.init2){
        this.init2 = true
        return        
      }
      this.setState({notify_cewo: true})
    })
  }


  handleItemClick = (e, { name }) => this.setState({ active_view: name })

  render(){
    const {active_view, width, height, notify_wake, notify_cewo} = this.state
    const view_height = height*0.9
    // console.log(notify_wake)
    return (
      <div style={{width: '100%', height: '100%', position:'absolute', overflow: 'hidden'}}>
        <img src={notify_wake_png} style={{position: 'absolute', top:notify_wake?5:-300, left: 0, width: '100%', transition: 'top 1.5s', zIndex: 30}} alt=''/>
        <img src={notify_cewo_png} 
          style={{display: notify_cewo?'block':'none',position: 'absolute', top:'30%', left: width/2-width/2.4, width: width/1.2, transition: 'top 0.3s', zIndex: 30}} alt=''
          onClick={()=> this.setState({notify_cewo: false})}
        />
        {/* 上部分导航栏 */}
        <div style={{width: '100%'}}>
          <Nav width={width} height={height}/>
        </div>
        <div style={{width: '100%', height: '100%'}}>
          <div style={{width: width, height: view_height, display: active_view==='定位'?'block':'none'}}>
            <MapView width={width} height={height}/>
          </div>
          <div style={{width: width, height: view_height, display: active_view==='数据'?'block':'none'}}>
            <DataView width={width} height={height}/>
          </div>
          <div style={{width: width, height: view_height, display: active_view==='状态'?'block':'none'}}>
            <StateView width={width} height={height}/>
          </div>
        </div>

        <div style={{width: width, height: height, display: active_view==='联系'?'block':'none', position: 'absolute', top: 0, left: 0, background: empty_color}}>
            <ContactView width={width} height={height}/>
        </div>
        <div style={{width: width, height: height, display: active_view==='更多'?'block':'none', position: 'absolute', top: 0, left: 0, background: empty_color}}>
            <MoreView width={width} height={height}/>
        </div>
      </div>
    );
  }
}


export default App;

const main_color = '#FCD350'
const empty_color = 'white'
export {
  main_color,
  empty_color
}
