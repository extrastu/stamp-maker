import { AspectRatioOption, StampStylePreset, StampOptions, ExportSettings, UserPreferences } from '../types';

export const RATIOS: AspectRatioOption[] = [
  { id: '1:1', label: '1:1', value: 1, width: 1, height: 1 },
  { id: '3:4', label: '3:4', value: 3 / 4, width: 3, height: 4 },
  { id: '4:3', label: '4:3', value: 4 / 3, width: 4, height: 3 },
  { id: '2:3', label: '2:3', value: 2 / 3, width: 2, height: 3 },
  { id: '9:16', label: '9:16', value: 9 / 16, width: 9, height: 16 },
];

export const STAMP_STYLES: StampStylePreset[] = [
  {
    id: 'classic',
    name: '标准齿孔',
    description: '标准经典邮票齿孔',
    holeRadiusRatio: 0.024,
    holeGapRatio: 0.065,
    insetRatio: 0,
    baseRadius: 18,
    baseGap: 46,
  },
  {
    id: 'fine',
    name: '密齿孔',
    description: '密集小齿孔',
    holeRadiusRatio: 0.016,
    holeGapRatio: 0.042,
    insetRatio: 0,
    baseRadius: 12,
    baseGap: 30,
  },
  {
    id: 'wide',
    name: '大齿孔',
    description: '现代大齿孔',
    holeRadiusRatio: 0.035,
    holeGapRatio: 0.095,
    insetRatio: 0,
    baseRadius: 26,
    baseGap: 68,
  },
];

export const COLOR_PRESETS = [
  { id: 'white', name: '纯白', hex: '#FFFFFF', isLight: true },
  { id: 'cream', name: '浅黄', hex: '#FCE5B5', isLight: true },
  { id: 'green', name: '青绿', hex: '#85D386', isLight: true },
  { id: 'pink', name: '粉红', hex: '#F7B8CE', isLight: true },
  { id: 'blue', name: '浅蓝', hex: '#96C7EB', isLight: true },
  { id: 'black', name: '曜黑', hex: '#1E1E1E', isLight: false },
];

export const DEFAULT_STAMP_OPTIONS: StampOptions = {
  style: 'classic',
  margin: 0, // Default to Full-Bleed 0 margin (perforations punched directly into photo)
  holeRadius: 18,
  holeGap: 46,
  backgroundColor: '#FFFFFF',
  photoRadius: 0,
  shadow: true,
};

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'png',
  resolution: 2160,
  transparent: true,
  paperColor: '#FFF4DD',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  ratioId: '3:4',
  styleId: 'classic',
  margin: 0,
  backgroundColor: '#FFFFFF',
  photoRadius: 0,
  exportResolution: 2160,
  exportTransparent: true,
};
