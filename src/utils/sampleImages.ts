import fujiImg from '../assets/samples/fuji.jpg';
import kyotoImg from '../assets/samples/kyoto.jpg';
import alpineImg from '../assets/samples/alpine.jpg';
import oceanImg from '../assets/samples/ocean.jpg';
import forestImg from '../assets/samples/forest.jpg';
import villageImg from '../assets/samples/village.jpg';

export interface SampleItem {
  id: string;
  title: string;
  url: string;
}

export const OFFLINE_SAMPLES: SampleItem[] = [
  {
    id: 'fuji',
    title: '富士山晨光',
    url: fujiImg,
  },
  {
    id: 'kyoto',
    title: '京都秋景',
    url: kyotoImg,
  },
  {
    id: 'alpine',
    title: '雪山湖泊',
    url: alpineImg,
  },
  {
    id: 'ocean',
    title: '海边日落',
    url: oceanImg,
  },
  {
    id: 'forest',
    title: '森林晨雾',
    url: forestImg,
  },
  {
    id: 'village',
    title: '欧风小镇',
    url: villageImg,
  },
];
