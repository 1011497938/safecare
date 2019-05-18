import React from 'react';
import { main_color } from '../App';
import { stateManager, dataStore } from '../Controller';
import AMapJS from "amap-js";
import my_location_icon from '../static/定位.png'
import refresh_bottom from '../static/更新.png'

export  default class MapView extends React.Component{
    componentDidMount(){
        this.initMap()
    }

    initMap(){
        // 创建AMapJSAPI Loader
        var aMapJSAPILoader = new AMapJS.AMapJSAPILoader({ key: "f868e1d118941a0bbf1bb85878d0c515" });

        // 创建AMapUI Loader
        var aMapUILoader = new AMapJS.AMapUILoader();
        const {container} = this.refs
        const component = this
        aMapJSAPILoader.load().then(function(AMap) {
            // console.log(AMap)
            var map = new AMap.Map('mapContainer',{
                zoom: 13
            })
            component.map = map

            // 定位置
            map.plugin('AMap.Geolocation', function() {
                var geolocation = new AMap.Geolocation({
                  // 是否使用高精度定位，默认：true
                  enableHighAccuracy: true,
                  // 设置定位超时时间，默认：无穷大
                  timeout: 10000,
                  // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                  buttonOffset: new AMap.Pixel(10, 20),
                  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                  zoomToAccuracy: true,     
                  //  定位按钮的排放位置,  RB表示右下
                  buttonPosition: 'RB'
                })
              
                geolocation.getCurrentPosition()
                AMap.event.addListener(geolocation, 'complete', onComplete)
                AMap.event.addListener(geolocation, 'error', onError)
              
                function onComplete (data) {
                    // data是具体的定位信息
                    console.log(data)
                    const {lng,lat} = data.position
                    const position = [lng, lat]
                    const dl = 0.0011

                    map.setZoomAndCenter(17, position);
                    component.location = position
                    // var location_marker_icon = new AMap.Icon({
                    //     size: new AMap.Size(40, 50),    // 图标尺寸
                    //     image: my_location_icon,  // Icon的图像
                    //     imageOffset: new AMap.Pixel(0, -60),  // 图像相对展示区域的偏移量，适于雪碧图等
                    //     imageSize: new AMap.Size(40, 50)   // 根据所设置的大小拉伸或压缩图片
                    // });
                    // 将 Icon 实例添加到 marker 上:
                    var location_marker = new AMap.Marker({
                        position: new AMap.LngLat(lng, lat),
                        // offset: new AMap.Pixel(-10, -10),
                        // icon: location_marker_icon, // 添加 Icon 实例
                        icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
                        title: '宝宝的位置',
                        // zoom: 20
                    });
                    // 添加中心点
                    map.add(location_marker)

                    // 添加范围
                    let points_around = [
                        [lng+0.0011, lat],
                        [lng, lat+0.0011],
                        [lng-0.0011, lat],
                        [lng, lat-0.0011],
                        [lng+0.0011, lat],
                    ]
                    points_around = points_around.map(elm=> new AMap.LngLat(elm[0], elm[1]))

                    let polyline = new AMap.Polyline({
                        path: points_around,  
                        borderWeight: 1, // 线条宽度，默认为 1
                        strokeColor: 'gray', // 线条颜色
                        strokeOpacity: 0.6,
                        strokeStyle: "dashed",
                        lineJoin: 'round' // 折线拐点连接处样式
                    })
                    map.add(polyline)

                    points_around.forEach(elm=>{
                        let marker = new AMap.Marker({
                            icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                            position: elm,
                            offset: new AMap.Pixel(-28, -53)
                        });
                        map.add(marker);
                    })

                    // console.log(map.PolyEditor)
                    // var polyEditor = new AMap.PolyEditor(map, polyline)

                }
              
                function onError (data) {
                  // 定位出错
                }
              })
            // aMapUILoader.load().then(function(initAMapUI) {
            //   var AMapUI = initAMapUI(); // 这里调用initAMapUI初始化并返回AMapUI。
            //   // 其他逻辑
            //   console.log(AMapUI)
            // });
        });
    }
    render(){
        const {width, height} = this.props
        return(
        <div style={{width: '100%', height: '100%'}}>
            <div ref='container' id='mapContainer' style={{width: '100%', height: '100%', zIndex: 15}}>
                
            </div>
            <div style={{width: '25%', height:40, zIndex: 30, bottom: 70, position: 'absolute', left: (50-12.5)+'%'}}>
                <img src={refresh_bottom} style={{width: width/4}} alt='' 
                onClick={()=>{
                    const {map} = this
                    console.log(map, this.location)
                    map.setZoomAndCenter(17, this.location);
                }}/>
            </div>
        </div>

        )
    }
}