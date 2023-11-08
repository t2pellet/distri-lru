import axios from 'axios';
import { Coord } from '@turf/helpers';

export interface Location {
  ip: string;
  point: Coord;
}

async function geoLocateIP(ip: string): Promise<Location | null> {
  try {
    const apiEndpont = `https://ipinfo.io/${ip}/json`;
    const response = await axios.get(apiEndpont);

    if (response.status == 200) {
      const { ip, loc } = response.data;
      const point = loc.split(',').map((v: string) => Number(v));
      return { ip, point };
    } else return null;
  } catch (err) {
    console.error('Failed to geolocate IP');
    return null;
  }
}

export default geoLocateIP;
