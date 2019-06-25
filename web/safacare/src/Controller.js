import { observable, action } from "mobx";

var stateManager = {
    active_view: observable.box('状态'),
    notify_wake: observable.box(true),
    notify_cewo: observable.box(true)
}
var getTotalA = (a)=>{
    return  Math.sqrt(a.reduce((total, elm)=> total+elm*elm, 0))
}

var isQuetA = (a)=>{
    const ratio = getTotalA(a)/getTotalA(dataStore.start_a)
    // console.log(ratio)
    return ratio<1.05 && ratio>0.95
}
var dataStore = {
    device_data: observable([]),
    start_a : undefined,
    updateDeviceData: action((data)=>{
        data.a = data.a.map(elm=> elm-30/2)
        let {time, a} = data
        time = Math.round(time*1000)
        data.time = time
        // console.log(time)
        dataStore.start_a = dataStore.start_a || a
        // console.log(a[0], a[1], a[2])
        // console.log(time, new Date(time))
        let device_data = dataStore.device_data.slice()
        device_data.push(data)
        device_data = device_data.sort((a,b)=> a.time-b.time)
        // console.log(device_data)
        dataStore.device_data.replace(device_data)
        // console.log(getTotalA(data.w), data.w)
        // console.log(getTotalA(a)-getTotalA(dataStore.start_a))
        // console.log(isQuetA(a),getTotalA(a)/getTotalA(dataStore.start_a))
    }),
    dataExchange: ()=>{
        setInterval(()=>{
            fetch('http://localhost:8000',{  //http://songciserver.vps.lppy.site:6060/  //http://192.168.43.83:8000/  //http://localhost:8000/
                method:'GET',
                headers:{
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                dataType:"jsonp",
                cache:'default',
                // mode: "no-cors",
            })
            .then(res =>res.json())
            .then(data => {
                dataStore.updateDeviceData(data)
            })
            .catch(e => console.log('错误:', e))
        }, 100)
    },
}
dataStore.dataExchange()

export default dataStore
export {
    dataStore,
    stateManager
}