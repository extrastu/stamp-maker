import { AspectRatioOption, StampStylePreset, StampOptions, ExportSettings, UserPreferences } from '../types';

export const RATIOS: AspectRatioOption[] = [
  { id: '3:4', label: '3:4 经典', value: 3 / 4, width: 3, height: 4 },
  { id: '1:1', label: '1:1 正方', value: 1, width: 1, height: 1 },
  { id: '4:3', label: '4:3 横版', value: 4 / 3, width: 4, height: 3 },
  { id: '2:3', label: '2:3 胶片', value: 2 / 3, width: 2, height: 3 },
  { id: '9:16', label: '9:16 竖版', value: 9 / 16, width: 9, height: 16 },
];

export const STAMP_STYLES: StampStylePreset[] = [
  {
    id: 'classic',
    name: 'Classic 经典',
    description: '标准经典邮票齿孔，规整精致',
    holeRadiusRatio: 0.024,
    holeGapRatio: 0.065,
    insetRatio: 0,
    baseRadius: 18,
    baseGap: 46,
  },
  {
    id: 'fine',
    name: 'Fine 密齿',
    description: '高密度小齿孔，复古手账感',
    holeRadiusRatio: 0.016,
    holeGapRatio: 0.042,
    insetRatio: 0,
    baseRadius: 12,
    baseGap: 30,
  },
  {
    id: 'wide',
    name: 'Wide 宽齿',
    description: '大齿孔设计，现代艺术感',
    holeRadiusRatio: 0.035,
    holeGapRatio: 0.095,
    insetRatio: 0,
    baseRadius: 26,
    baseGap: 68,
  },
];

export const COLOR_PRESETS = [
  { id: 'ivory', name: '象牙白', hex: '#FFFDF8', border: '#EFEAE1' },
  { id: 'white', name: '纯白', hex: '#FFFFFF', border: '#E5E5E5' },
  { id: 'cream', name: '复古米黄', hex: '#F4EBD9', border: '#E4DAC6' },
  { id: 'pink', name: '淡樱粉', hex: '#FCECEC', border: '#F0D6D6' },
  { id: 'blue', name: '浅雾蓝', hex: '#E6EFF7', border: '#D3E1EC' },
  { id: 'green', name: '青草绿', hex: '#E8EFE5', border: '#D5E1D1' },
  { id: 'black', name: '曜石黑', hex: '#1F1E1D', border: '#333333' },
];

export const DEFAULT_STAMP_OPTIONS: StampOptions = {
  style: 'classic',
  margin: 36, // default border margin in px (scaled)
  holeRadius: 18,
  holeGap: 46,
  backgroundColor: '#FFFDF8',
  photoRadius: 4,
  shadow: true,
};

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'png',
  resolution: 2160,
  transparent: true,
  paperColor: '#F5F1E8',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  ratioId: '3:4',
  styleId: 'classic',
  margin: 36,
  backgroundColor: '#FFFDF8',
  photoRadius: 4,
  exportResolution: 2160,
  exportTransparent: true,
};
