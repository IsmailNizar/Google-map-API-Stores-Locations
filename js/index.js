var infoWindow;

window.onload = () => {
  displayStores();
  storeMarker();
}

// Initialize and add the map
function initMap() {
  
  // The location of losAngelos
    var losAngelos = {
            lat: 34.063380,
            lng: -118.358080
        };
    // The map, centered at losAngelos
      map = new google.maps.Map(document.getElementById('map'), {
      center: losAngelos,
      zoom: 10,
      mapTypeId: 'roadmap',
    });
  }

function displayStores(){
  
  var storesListContaier = "";
  for(let [index, store] of stores.entries()){
    storesListContaier += `
      <div id="test" class="store-container">
        <div class="store-info">
            <div class="store-address">
                <span> ${store.addressLines[0]} </span>
                <span>${store.addressLines[1]}</span>
            </div>
            <div class="store-phoneNumber">
                ${store.phoneNumber}
            </div>
        </div>
        <div class="store-idNumber">
            ${index+1}
        </div>
      </div>
    `; 
  }
  document.querySelector(".stores-list").innerHTML = storesListContaier;
}


function storeMarker(){
  
  var infoWindow = new google.maps.InfoWindow;
  // open info window
  var onMarkerClick = function() {
    var marker = this;
    infoWindow.setContent( marker.contentString );
    infoWindow.open(map, marker);
    mkmap.lastmarkeropened = marker;
  };
  // close the info window when click in any place in map
  google.maps.event.addListener(map, 'click', function() {
    infoWindow.close();
  });
  var bounds = new google.maps.LatLngBounds();
  for(let [index, storeM] of stores.entries()){
    
    let storePosition = {
      lat: storeM.coordinates.latitude,
      lng: storeM.coordinates.longitude
    }
    let contentString = `
      <div class="store-info-window">
      <h3 id="title-store">${storeM.name}</h3>
      <p id="WorkTime-store">${storeM.openStatusText}</p>
      </div>
      <div>
        <div class="store-info-window-address">
          <div class="store-info-window-icon">
            <i class="	fas fa-external-link-square-alt " style="color:#454E53"></i>
          </div> 
          <p>${storeM.address.streetAddressLine1}</p>
        </div>
        <div class="store-info-window-address">
          <div class="store-info-window-icon">
            <i class="fa fa-phone-square fa-rotate-90" style="color:#454E53"></i>
          </div>
          <p>${storeM.phoneNumber}</p>
        </div>
      </div>
    `;

    bounds.extend(storePosition);
    var marker = new google.maps.Marker({
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: storePosition,
      icon: 'marker.png',
      label: {text: (index+1).toString(), color: "white"},
      contentString: contentString
    });
    google.maps.event.addListener(marker, 'click', onMarkerClick );
  }
  map.fitBounds(bounds);
  
}