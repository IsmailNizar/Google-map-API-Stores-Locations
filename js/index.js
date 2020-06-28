var infoWindow;
var markers = [];

function initMap() {
  /* Initialize and add the map  */

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
  searchStore();
}

function searchStore(){
  /* Search a specific sotre from the list using ZIP code  */

  var foundStores =[];
  let zip = document.getElementById("zip-code-input").value;
  if(zip){
    if (! parseInt(zip) && zip !== ""){
      alert('enter a valid zip code');
    }else{
      for(let [index, store] of stores.entries()){
        console.log(store.address.postalCode.substring(0, 5));
        if (store.address.postalCode.substring(0, 5).includes(zip)){
          foundStores.push(store);
        }
      }
    }
  }else{
    foundStores = stores;
  }
  // clear location for every search
  clearLocations();
  displayStores(foundStores);
  storeMarker(foundStores);
  
}

function displayStores(stores){
  /*  Display list of stores  */

  var storesListContaier = "";
  // stores is a list of stores
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
        <div class="store-idNumber" id="idNumber">
            ${index+1}
        </div>
      </div>
    `; 
  }
  document.querySelector(".stores-list").innerHTML = storesListContaier;
  SetOnClickListenner();
}

function clearLocations(){
  /* Clear all location in the map  */

  for (var mark of markers){
    mark.setMap(null);
  }
  markers.length = 0;
}

function storeMarker(stores){
  /* Display store's markers in the map,
     Display when click the info window of the store  */
  
  var infoWindow = new google.maps.InfoWindow;
  // function in a variable that open info window
  var onMarkerClick = function() {
    var marker = this;
    infoWindow.setContent( marker.contentString );
    infoWindow.open(map, marker);
    // mkmap.lastmarkeropened = marker;
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
            <i class="	fas fa-external-link-square-alt " style="color:#1985A1"></i>
          </div> 
          <p>${storeM.address.streetAddressLine1}</p>
        </div>
        <div class="store-info-window-address">
          <div class="store-info-window-icon">
            <i class="fa fa-phone-square fa-rotate-90" style="color:#1985A1"></i>
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
    // add marker to the list of markers
    markers.push(marker);
    // add eventListener to every marker to show InfoWindow
    google.maps.event.addListener(marker, 'click', onMarkerClick );
  }
  map.fitBounds(bounds);
}

function SetOnClickListenner(){
  /* Display list of stores avaibles in JSON file  */

  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach( (storeElement, index) => {
    storeElement.addEventListener('click', () =>{
      new google.maps.event.trigger(markers[index], 'click');
    });
  });
}