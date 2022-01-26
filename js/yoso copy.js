

var HOME_PATH = window.HOME_PATH || '.';

var htmlMarker1 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ HOME_PATH +'/img/cluster-marker-1.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
},
htmlMarker2 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ HOME_PATH +'/img/cluster-marker-2.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
},
htmlMarker3 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ HOME_PATH +'/img/cluster-marker-3.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
},
htmlMarker4 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ HOME_PATH +'/img/cluster-marker-4.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
},
htmlMarker5 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ HOME_PATH +'/img/cluster-marker-5.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
};

function showMarker(map, marker) {

    if (marker.getMap()) return;
    marker.setMap(map);
   
}

function hideMarker(map, marker) {

    if (!marker.getMap()) return;
    marker.setMap(null);
}

var map = new naver.maps.Map(document.getElementById('map'), {
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
    zoomControl: true,
    zoomControlOptions: {
        position: naver.maps.Position.TOP_LEFT,
        style: naver.maps.ZoomControlStyle.SMALL
    },
    minZoom: 6,
    zoom: 13,
    center: new naver.maps.LatLng(37.5666805, 126.9784147)
});
var markers = [];



var nowMarker;
var nowLocation = new naver.maps.InfoWindow();
function onSuccessGeolocation(position) {
    var location = new naver.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

    map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
    map.setZoom(13); // 지도의 줌 레벨을 변경합니다.

    nowLocation.setContent('<div style="padding:20px;">' + '현재 위치' + '</div>');

    nowLocation.open(map, location);


    var icon = {
            url: HOME_PATH +'/img/example/ico_pin.jpg',
            size: {width: 33, height: 45},
            scaledSize : new naver.maps.Size(33, 45),
            anchor: new naver.maps.Point(17, 20),
            origin: new naver.maps.Point(0, 0)
        }

    nowMarker = new naver.maps.Marker({
    icon : icon,
    position: new naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
    map: map

        

    });
    
}



function onErrorGeolocation() {
    var center = map.getCenter();

    infowindow.setContent('<div style="padding:20px;">' +
        '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');

    infowindow.open(map, center);
}

$(window).on("load", function() {
    if (navigator.geolocation) {
        /**
         * navigator.geolocation 은 Chrome 50 버젼 이후로 HTTP 환경에서 사용이 Deprecate 되어 HTTPS 환경에서만 사용 가능 합니다.
         * http://localhost 에서는 사용이 가능하며, 테스트 목적으로, Chrome 의 바로가기를 만들어서 아래와 같이 설정하면 접속은 가능합니다.
         * chrome.exe --unsafely-treat-insecure-origin-as-secure="http://example.com"
         */
        navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
        
    } else {
        var center = map.getCenter();
        infowindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>');
        infowindow.open(map, center);
    }
});


(function(){
   
   $.ajax({
     type:"get",
     url:"https://api.odcloud.kr/api/uws/v1/inventory?page=1&perPage=10000&serviceKey=hCNJd03rYvvexwy6ePp8Y7BvY8fdKjTbUhMtj6nM4Mm4yV1B6zaD713epk7b1iZVGFo6Zo1XG%2FEaJP%2F2wy5KrQ%3D%3D",
     data : {

     },
     dataType:"json",
     success: function(data){console.log(data)

     	var infoWindows = [];

     	for(var i=0; i<data.currentCount; i++){
             var price = data.data[i].price;
            if(price == null || price == 0 || price == "undefined"){
                price = "정보없음";
            }else{
                price += "원";
            }
            var now_hour = new Date().getHours();
            var update_hour = new Date(data.data[i].regDt).getHours();
            if(now_hour < update_hour){
                now_hour += 24;
            }
            var show_hour = now_hour - update_hour + "시간 전";
            if(now_hour - update_hour == 0){
                show_hour = "1시간 이내";
            }
            var openTime = data.data[i].openTime;
            if(openTime == null ||openTime == "null"){
                openTime = "정보없음";
            }
                    
            var latlngs = new naver.maps.LatLng(data.data[i].lat, data.data[i].lng);
            var url;

            if(data.data[i].inventory > 1){
                url = HOME_PATH +'/img/example/pin_default.png';
                
            }else{
                url= HOME_PATH +'/img/example/marker-default.png';
            }
            
            var icon = {
                url: url,
                size: new naver.maps.Size(36,55),
                scaledSize: new naver.maps.Size(36,55),
                origin: new naver.maps.Point(0, 0),
                 anchor: new naver.maps.Point(12, 37)
                },
                marker = new naver.maps.Marker({
                    position: latlngs,
                    map: map,
                    icon: icon,
                });

            marker.set('seq', i);



        var infoWindow = new naver.maps.InfoWindow({
            content: '<span id="info"><div style="color:red;">업데이트 시간 : '+show_hour+'</div>'+
                    '<div  style="text-align:left;padding:5px;">'+
                        '<div style="color:red;">재고량&nbsp;&nbsp;&nbsp;: '+data.data[i].inventory+'</div>'+
                        '<div>매장명&nbsp;&nbsp;&nbsp;: '+ data.data[i].name +'</div>'+
                        '<div>주소 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: '+data.data[i].addr+'</div>'+
                        '<div>가격 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: '+price+'(리터당)</div></div>'+
                        '<div>전화번호 : '+data.data[i].tel+'</div>'+
                        '<div>영업시간 : '+openTime+'</div></span>'
                        
                        
                        

        });

        

        var mapBounds = map.getBounds();
        position = marker.getPosition();

        if (mapBounds.hasLatLng(position)) {
            showMarker(map, marker);
        } else {
            hideMarker(map, marker);
        }

        markers.push(marker);
        infoWindows.push(infoWindow);    

        

        infowindow1 = null;
        contentString = null;
        icon = null;
        marker = null; 
            
     }

     var markerClustering = new MarkerClustering({
        minClusterSize: 2,
        maxZoom: 13,
        map: map,
        markers: markers,
        disableClickZoom: false,
        gridSize: 120,
        icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
        indexGenerator: [10, 100, 200, 500, 1000],
        stylingFunction: function(clusterMarker, count) {
            $(clusterMarker.getElement()).find('div:first-child').text(count);
        }

    });

     
     
    
    function getClickHandler(seq) {
        return function(e) {
            var marker = markers[seq],
                infoWindow = infoWindows[seq];

            if (infoWindow.getMap()) {
                infoWindow.close();
            } else {
                infoWindow.open(map, marker);
            }
        }
    }

    for (var i=0, ii=markers.length; i<ii; i++) {
        naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
    }

    },
     error: function(err){console.log(err)}
   })

   
   
}());




    
