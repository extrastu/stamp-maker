import { AspectRatioOption, StampStylePreset, StampOptions, TicketOptions, ExportSettings, UserPreferences } from '../types';

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

export const TICKET_COLOR_PRESETS = [
  { id: 'moss', name: '苔藓绿', hex: '#587052', isLight: false },
  { id: 'sunset', name: '落日橙', hex: '#EA7C56', isLight: false },
  { id: 'slate', name: '灰蓝', hex: '#526E86', isLight: false },
  { id: 'terracotta', name: '砖红', hex: '#8C483D', isLight: false },
  { id: 'skymist', name: '雪青', hex: '#7DA6BD', isLight: false },
  { id: 'sage', name: '抹茶', hex: '#798E60', isLight: false },
  { id: 'cream', name: '米黄', hex: '#E2C799', isLight: true },
  { id: 'dark', name: '黑巧', hex: '#26201A', isLight: false },
];

export const TICKET_STATION_PRESETS = [
  { title: 'GREAT WALL OF CHINA', subtitle: '万里长城', themeColor: '#587052' },
  { title: 'MOUNT FUJI', subtitle: '富士山', themeColor: '#7DA6BD' },
  { title: 'GOLDEN GATE BRIDGE', subtitle: '金门大桥', themeColor: '#EA7C56' },
  { title: 'GRAND CANYON', subtitle: '大峡谷', themeColor: '#8C483D' },
  { title: 'TAJ MAHAL', subtitle: '泰姬陵', themeColor: '#526E86' },
  { title: 'SWISS ALPS', subtitle: '阿尔卑斯山', themeColor: '#798E60' },
  { title: 'SYDNEY OPERA HOUSE', subtitle: '悉尼歌剧院', themeColor: '#7DA6BD' },
];

export const DEFAULT_STAMP_OPTIONS: StampOptions = {
  style: 'classic',
  margin: 0,
  holeRadius: 18,
  holeGap: 46,
  backgroundColor: '#FFFFFF',
  photoRadius: 0,
  shadow: true,
};

const now = new Date();
const currentYear = String(now.getFullYear());
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
const currentDate = String(now.getDate()).padStart(2, '0');

export const DEFAULT_TICKET_OPTIONS: TicketOptions = {
  stationTitle: 'GREAT WALL OF CHINA',
  stationSubtitle: '万里长城',
  subTitle: 'NEXT STATION',
  year: currentYear,
  date: `${currentMonth}.${currentDate}`,
  ticketNo: '120458464677987155',
  themeColor: '#587052',
  textColor: '#FFFFFF',
  photoRadius: 18,
};

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'png',
  resolution: 2160,
  transparent: true,
  paperColor: '#FFF4DD',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  mode: 'stamp',
  ratioId: '3:4',
  styleId: 'classic',
  margin: 0,
  backgroundColor: '#FFFFFF',
  photoRadius: 0,
  exportResolution: 2160,
  exportTransparent: true,
};
