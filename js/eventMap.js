// let mayMap = L.map('map').setView([25.035463180787303, 121.4316199761982], 18)
// L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mayMap)
// L.circle([25.035463180787303, 121.4316199761982], 10, {}).addTo(mayMap)


document.addEventListener('DOMContentLoaded', () => {
    const taiwan = [25.03558188243541, 121.43157119439084]; // 預設中心點為輔大

    // 建立地圖
    let zoom = 19; // 0-18
    let map = L.map('map', {
        zoomControl: true, // 是否秀出 - + 按鈕
        touchZoom: false,// 是否限制手機縮放
        scrollWheelZoom: false,// 是否限制滑鼠縮放
    }).setView(taiwan, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxNativeZoom: 19,
        maxZoom: 19,
        attribution: '© OpenStreetMap', // 商用時必須要有版權出處
    }).addTo(map);


    L.circle([25.035499271703063, 121.43153364882508], 12, {}).addTo(map)

    // 建立 marker
    const customIcon = L.icon({
        iconUrl: 'icon/pikacu.gif',
        iconSize: [90, 65],
    });

    const marker = L.marker(taiwan, {
        icon: customIcon,
    }).addTo(map);

    marker.bindPopup("已達指定地點！");


    // 假设我们希望检测用户是否到达这个指定地点
    let targetLocation = L.latLng(25.035499271703063, 121.43153364882508); // 目標地點的經緯度
    let targetRadius = 12; // 目標地點的半徑，單位為公尺


    // 跟使用者要位置
    // 參考文件：https://leafletjs.com/examples/mobile/、https://leafletjs.com/reference.html#map-locate
    map.locate({
        setView: false,
        watch: true,
        maxZoom: 19,
        enableHighAccuracy: true
    });


    // 使用者不提供位置
    function errorHandler(e) {
        window.alert('無法判斷您的所在位置，無法使用此功能。預設地點將為 台灣的中心');
        map.setView(taiwan, 18); // 中心移到台灣的中心
        moveTo(map); // 移動到指定座標（平滑 || 縮放 效果）
        panBy(map); // 移動 x, y 位置
    }
    map.on('locationerror', errorHandler);

    // 使用者提供位置
    function foundHandler(e) {
        map.panTo(e.latlng); // 移動地圖中心點到使用者所在位置
        marker.setLatLng(e.latlng); // 移動 marker
        moveTo(map); // 移動到指定座標（平滑 || 縮放 效果）
        panBy(map); // 移動 x, y 位置
        var userLocation = e.latlng; // 使用者當前位置
        var distance = userLocation.distanceTo(targetLocation); // 計算與目標地點的距離
        if (distance <= targetRadius) {
            marker.openPopup();
        } else {
            marker.closePopup();
        }
    }
    map.on('locationfound', foundHandler);


    // 移動到指定座標（平滑 || 縮放 效果）
    function moveTo(map) {
        const btnPanto = document.querySelectorAll('.js-panto');
        Array.prototype.forEach.call(btnPanto, pan => {
            pan.addEventListener('click', e => {
                e.preventDefault();
                let latLng = e.target.dataset.to.split(',');
                let name = e.target.textContent;
                let toggleFly = document.getElementById('flyTo').checked;
                const popup = L.popup();
                popup
                    .setLatLng(latLng)
                    .setContent(`${name}`)
                    .openOn(map);
                toggleFly ? map.flyTo(latLng) : map.panTo(latLng);
            })
        })
    }

    // // 移動 x, y 位置
    function panBy(map) {
        const btnPanby = document.querySelectorAll('.js-panby');
        Array.prototype.forEach.call(btnPanby, pan => {
            pan.addEventListener('click', e => {
                e.preventDefault();
                let times = e.target.dataset.times;
                let point = 50 * times;
                let points = [point, point];
                map.panBy(points);
            })
        })
    }

})