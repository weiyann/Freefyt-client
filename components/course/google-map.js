import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import styles from '@/styles/course/course-detail.module.css'

export default function GoogleMap({ course }) {
  const mapRef = useRef(null);
  const [infoWindowContent, setInfoWindowContent] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  let map;
  let marker;
  let infoWindow;
  let directionsService;
  let directionsRenderer;
  let location;


  // 使用 DirectionsService 規劃路線
  const handleShowRoute = () => {
    let location;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          const destination = new google.maps.LatLng(
            location.lat,
            location.lng
          );

          const request = {
            origin: userLocation,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
          };

          directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
              directionsRenderer.setMap(map);
            } else {
              console.error('路線規劃失敗:', status);
            }
          });
        },
        (error) => {
          console.error('取得使用者位置失敗:', error);
        }
      );
    } 
  };

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
        version: 'weekly',
      });

      try {
        const google = await loader.load();

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            `${course.row && course.row.gym_address}`
          )}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`
        );
        const data = await response.json();

        location = data.results[0].geometry.location; // 更新 location 的值

        infoWindow = new google.maps.InfoWindow({
          pixelOffset: { width: 0, height: -100 },
        });

        const mapOptions = {
          center: location,
          zoom: 19,
          mapId: 'MY_NEXYJS_MAPID',
        };

        map = new google.maps.Map(mapRef.current, mapOptions);

        marker = new google.maps.Marker({
          position: location,
          map: map,
          title: '我在這裡',
          icon: {
            url: '/image/logo.png',
            scaledSize: new google.maps.Size('120', '120'),
          },
        });

        marker.addListener('click', () => {
          if (infoWindow) {
            infoWindow.setPosition(location);
            infoWindow.setContent(
              `<h2>${course.row && course.row.gym_name}</h2><br/><h4>地址：${
                course.row && course.row.gym_address
              }</h4>`
            );
            infoWindow.open(map);
          }
        });

        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              );
              const destination = new google.maps.LatLng(
                location.lat,
                location.lng
              );

              // const request = {
              //   origin: userLocation,
              //   destination: destination,
              //   travelMode: google.maps.TravelMode.DRIVING,
              // };

              // directionsService.route(request, (result, status) => {
              //   if (status === google.maps.DirectionsStatus.OK) {
              //     directionsRenderer.setDirections(result);
              //     directionsRenderer.setMap(map);
              //   } else {
              //     console.error('路線規劃失敗:', status);
              //   }
              // });
            },
            (error) => {
              console.error('取得使用者位置失敗:', error);
            }
          );
        } else {
          console.error('瀏覽器不支援地理位置功能');
        }
      } catch (error) {
        console.error('Google Maps API 加載失敗:', error);
      }
    };

    initMap();
  }, [course.row]);

  useEffect(() => {
    if (infoWindowPosition && infoWindowContent && infoWindow) {
      infoWindow.setPosition(infoWindowPosition);
      infoWindow.setContent(infoWindowContent);
      infoWindow.open(map);
    }
  }, [infoWindowPosition, infoWindowContent, infoWindow]);

  return (
    <>
    {/* <button onClick={handleShowRoute} className={styles['route']}>顯示路線</button> */}
      <div style={{ height: '600px', width: '800px' }} ref={mapRef}></div>
    </>
  );
}