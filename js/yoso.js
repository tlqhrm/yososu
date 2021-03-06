

var HOME_PATH = window.HOME_PATH || '.';



var map = new naver.maps.Map(document.getElementById('map'), {
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
    zoomControl: true,
    minZoom: 6,
    zoom: 8,
    center: new naver.maps.LatLng(36.5666805, 127.9784147)
});

var nowMarker;
var nowLocation = new naver.maps.InfoWindow();
function onSuccessGeolocation(position) {
    var location = new naver.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

    map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
    map.setZoom(10); // 지도의 줌 레벨을 변경합니다.

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
    console.log('Coordinates: ' + location.toString());
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
     url:"https://api.odcloud.kr/api/15094782/v1/uddi:6b2017af-659d-437e-a549-c59788817675?page=1&perPage=111&serviceKey=hCNJd03rYvvexwy6ePp8Y7BvY8fdKjTbUhMtj6nM4Mm4yV1B6zaD713epk7b1iZVGFo6Zo1XG%2FEaJP%2F2wy5KrQ%3D%3D",
     data : {

     },
     dataType:"json",
     success: function(data){console.log(data)
       

        console.log(HOME_PATH);
    	console.log(data.currentCount);
     	console.log(data.data[0]);
     	console.log(data.data[0].코드);
        
         document.getElementById("time").textContent = '데이터 기준시간 : ' + data.data[0].데이터기준일;
     	
        var markers = [];
     	var infoWindows = [];
     	var elem="";
     	for(var i=0; i<data.currentCount; i++){
     		elem +=  '<tr>'+
     					// '<td >'+
				    	// 	data.data[i].코드+
				    	// '</td>'+
				    	'<td >'+
				    		data.data[i].명칭+
				    	'</td>'+
				    	'<td >'+
				    		data.data[i].주소+
				    	'</td>'+
				    	'<td >'+
				    		data.data[i].전화번호+
				    	'</td>'+
				    	'<td >'+
				    		data.data[i].영업시간+
				    	'</td>'+
				    	'<td>'+
				    		data.data[i].재고량+
				    	'</td>'+
				    	'<td>'+
				    		data.data[i].가격+
				    	'</td>'+
				    	// '<td>'+
				    	// 	data.data[i].위도+
				    	// '</td>'+
				    	// '<td>'+
				    	// 	data.data[i].경도+
				    	// '</td>'+
				    	// '<td>'+
				    	// 	data.data[i].데이터기준일+
				    	// '</td>'+
				    '</tr>';
                    
            var latlngs = new naver.maps.LatLng(data.data[i].위도, data.data[i].경도);
            // var marker;
            var url;
            if(data.data[i].재고량 > 1 || data.data[i].재고량.length > 1 ){
                url = HOME_PATH +'/img/example/pin_default.png';
                console.log(data.data[i].재고량);
            }else{
                url= HOME_PATH +'/img/example/marker-default.png';
            }
            
            var icon = {
                url: url,
                size: new naver.maps.Size(24, 37),
                origin: new naver.maps.Point(0, 0),
                 anchor: new naver.maps.Point(12, 37)
                },
                marker = new naver.maps.Marker({
                    position: latlngs,
                    map: map,
                    icon: icon
                });

            marker.set('seq', i);

        // marker.addListener('mouseover', onMouseOver);
        // marker.addListener('mouseout', onMouseOut);

        var infoWindow = new naver.maps.InfoWindow({
            content: '<div  style="text-align:left;padding:5px;">'+
                        '<div style="color:red;">재고량&nbsp;&nbsp;&nbsp;: '+data.data[i].재고량+'</div>'+
                        '<div>매장명&nbsp;&nbsp;&nbsp;: '+ data.data[i].명칭 +'</div>'+
                        '<div>주소 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: '+data.data[i].주소+'</div>'+
                        '<div>가격 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: '+data.data[i].가격+'</div></div>'+
                        '<div>전화번호 : '+data.data[i].전화번호+'</div>'+
                        '<div>영업시간 : '+data.data[i].영업시간+'</div>'
                        
                        

        });

        markers.push(marker);
        infoWindows.push(infoWindow);    

        

        infowindow1 = null;
        contentString = null;
        icon = null;
        marker = null; 
            
     }
    
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

    document.getElementById("tbody").innerHTML += elem;
     	
     	
    },
     error: function(err){console.log(err)}
   })

   
}());