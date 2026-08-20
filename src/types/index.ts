import { Area } from 'react-easy-crop';

export type AspectRatioId = '1:1' | '3:4' | '4:3' | '2:3' | '9:16';

export interface AspectRatioOption {
  id: AspectRatioId;
  label: string;
  value: number;
  width: number;
  height: number;
}

export type MakerMode = 'stamp' | 'ticket';

export type TicketOrientation = 'vertical' | 'horizontal';

export type StampStyleId = 'classic' | 'fine' | 'wide' | 'custom';

export interface StampStylePreset {
  id: StampStyleId;
  name: string;
  description: string;
  holeRadiusRatio: number; // Ratio relative to base dimension
  holeGapRatio: number;
  insetRatio: number;
  baseRadius: number; // in px for standard 1000px dimension
  baseGap: number;
}

export interface StampOptions {
  style: StampStyleId;
  margin: number; // White border between photo and perforation in px (relative to base size)
  holeRadius: number; // Radius of hole in px (relative to base size)
  holeGap: number; // Distance between hole centers in px
  backgroundColor: string; // Background color of stamp paper inner border
  photoRadius: number; // Rounded corner for photo inside stamp
  shadow: boolean; // Soft shadow in preview
  backdropEnabled: boolean; // Place stamp inside an outer backdrop card
  backdropColor: string; // Background color of the outer backdrop card
}

export interface TicketOptions {
  orientation: TicketOrientation; // 'vertical' | 'horizontal'
  stationTitle: string; // e.g. "GREAT WALL OF CHINA"
  stationSubtitle: string; // e.g. "万里长城"
  subTitle: string; // e.g. "NEXT STATION"
  year: string; // e.g. "2026"
  date: string; // e.g. "08.20"
  ticketNo: string; // e.g. "120458464677987155"
  themeColor: string; // Background color of ticket card
  textColor: string; // Text color on ticket
  photoRadius: number; // Rounded corner of photo on ticket
  backdropEnabled: boolean; // Place ticket inside an outer backdrop card
  backdropColor: string; // Background color of the outer backdrop card
}

export interface ExportSettings {
  format: 'png' | 'jpeg' | 'webp';
  resolution: 1080 | 2160 | 3240; // Max dimension
  transparent: boolean; // Transparent holes & surroundings
  paperColor: string; // If not transparent, what background to put around
}

export interface UserPreferences {
  mode: MakerMode;
  ratioId: AspectRatioId;
  styleId: StampStyleId;
  margin: number;
  backgroundColor: string;
  photoRadius: number;
  exportResolution: 1080 | 2160 | 3240;
  exportTransparent: boolean;
}

export type AppStep = 'start' | 'crop' | 'edit';

export interface ImageItem {
  id: string;
  file: File | null;
  name: string;
  rawUrl: string;
  croppedUrl: string | null;
  croppedAreaPixels: Area | null;
  ratioId: AspectRatioId;
  rotation: number;
  ticketOptions?: TicketOptions;
}

export interface ImageState {
  file: File | null;
  name: string;
  rawUrl: string | null;
  croppedUrl: string | null;
  croppedAreaPixels: Area | null;
}
