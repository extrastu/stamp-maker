import { Area } from 'react-easy-crop';

export type AspectRatioId = '1:1' | '3:4' | '4:3' | '2:3' | '9:16';

export interface AspectRatioOption {
  id: AspectRatioId;
  label: string;
  value: number;
  width: number;
  height: number;
}

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
  backgroundColor: string; // Background color of stamp paper
  photoRadius: number; // Rounded corner for photo inside stamp
  shadow: boolean; // Soft shadow in preview
}

export interface ExportSettings {
  format: 'png' | 'jpeg' | 'webp';
  resolution: 1080 | 2160 | 3240; // Max dimension
  transparent: boolean; // Transparent holes & surroundings
  paperColor: string; // If not transparent, what background to put around
}

export interface UserPreferences {
  ratioId: AspectRatioId;
  styleId: StampStyleId;
  margin: number;
  backgroundColor: string;
  photoRadius: number;
  exportResolution: 1080 | 2160 | 3240;
  exportTransparent: boolean;
}

export type AppStep = 'start' | 'crop' | 'edit';

export interface ImageState {
  file: File | null;
  name: string;
  rawUrl: string | null;
  croppedUrl: string | null;
  croppedAreaPixels: Area | null;
}
