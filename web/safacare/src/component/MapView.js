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
                    var icon = new AMap.Icon({
                        // 图标尺寸
                        size: new AMap.Size(25, 25),
                        // 图标的取图地址
                        image: 'data:image/png;base64,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',
                        // 图标所用图片大小
                        imageSize: new AMap.Size(25, 25),
                        // 图标取图偏移量
                        // imageOffset: new AMap.Pixel(-9, -3)
                    });

                    var location_marker = new AMap.Marker({
                        position: new AMap.LngLat(lng, lat),
                        icon: icon,
                        offset: new AMap.Pixel(-13, -20)
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
                    // 创建一个 Icon
                        var icon = new AMap.Icon({
                            // 图标尺寸
                            size: new AMap.Size(25, 25),
                            // 图标的取图地址
                            image: 'data:image/png;base64,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',
                            // 图标所用图片大小
                            imageSize: new AMap.Size(25, 25),
                            // 图标取图偏移量
                            // imageOffset: new AMap.Pixel(-9, -3)
                        });
    //  'data:image/png;base64,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',
                        // 将 icon 传入 marker
                        var marker = new AMap.Marker({
                            position:elm,
                            icon: icon,
                            offset: new AMap.Pixel(-13, -20)
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

            // component.location =  new AMap.LngLat(30.143, 120.237)
            // // console.log(this.map, this.location)
            // component.map.setZoomAndCenter(17, component.location);
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