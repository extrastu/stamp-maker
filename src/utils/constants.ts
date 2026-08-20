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

export const BACKDROP_COLOR_PRESETS = [
  { id: 'transparent', name: '透明无底', hex: 'transparent', isLight: true },
  { id: 'paper', name: '暖黄纸', hex: '#FFF4DD', isLight: true },
  { id: 'purewhite', name: '纯白底', hex: '#FFFFFF', isLight: true },
  { id: 'dark', name: '极夜黑', hex: '#1E1E1E', isLight: false },
  { id: 'moss', name: '森林绿', hex: '#587052', isLight: false },
  { id: 'slate', name: '灰蓝调', hex: '#7B96B2', isLight: false },
  { id: 'sunset', name: '落日橙', hex: '#EA7C56', isLight: false },
  { id: 'terracotta', name: '陶土红', hex: '#8C483D', isLight: false },
  { id: 'pink', name: '柔雾粉', hex: '#F7B8CE', isLight: true },
  { id: 'oat', name: '燕麦米', hex: '#D8CBB5', isLight: true },
];

export const TICKET_COLOR_PRESETS = [
  { id: 'oat', name: '燕麦米', hex: '#D8CBB5', isLight: true },
  { id: 'mutedblue', name: '灰蓝', hex: '#7B96B2', isLight: false },
  { id: 'taupe', name: '暖灰褐', hex: '#B8A18E', isLight: false },
  { id: 'sage', name: '抹茶绿', hex: '#8E9A82', isLight: false },
  { id: 'dustyrose', name: '暮色粉', hex: '#C68B93', isLight: false },
  { id: 'slateash', name: '浅青灰', hex: '#BAC2C7', isLight: true },
  { id: 'sunset', name: '落日橙', hex: '#EA7C56', isLight: false },
  { id: 'charcoal', name: '炭灰', hex: '#6B7077', isLight: false },
  { id: 'dark', name: '曜黑', hex: '#2A2521', isLight: false },
];

export const VERTICAL_TICKET_PRESETS = [
  { title: 'GREAT WALL OF CHINA', subtitle: '万里长城', themeColor: '#8E9A82' },
  { title: 'MOUNT FUJI', subtitle: '富士山', themeColor: '#7B96B2' },
  { title: 'GOLDEN GATE BRIDGE', subtitle: '金门大桥', themeColor: '#EA7C56' },
  { title: 'GRAND CANYON', subtitle: '大峡谷', themeColor: '#B8A18E' },
  { title: 'TAJ MAHAL', subtitle: '泰姬陵', themeColor: '#D8CBB5' },
  { title: 'SWISS ALPS', subtitle: '阿尔卑斯山', themeColor: '#BAC2C7' },
  { title: 'SYDNEY OPERA HOUSE', subtitle: '悉尼歌剧院', themeColor: '#7B96B2' },
];

export const HORIZONTAL_TICKET_PRESETS = [
  { title: 'EXPLORE', subtitle: '探索发现', themeColor: '#D8CBB5' },
  { title: 'SUNSET', subtitle: '落日余晖', themeColor: '#C68B93' },
  { title: 'HIKING', subtitle: '徒步山野', themeColor: '#8E9A82' },
  { title: 'MOUNTAIN', subtitle: '雪山之巅', themeColor: '#7B96B2' },
  { title: 'SURFING', subtitle: '追浪逐海', themeColor: '#B8A18E' },
  { title: 'DIVING', subtitle: '潜入深蓝', themeColor: '#7B96B2' },
  { title: 'WINTER', subtitle: '凛冬白雪', themeColor: '#BAC2C7' },
  { title: 'CAVE', subtitle: '秘境洞穴', themeColor: '#6B7077' },
  { title: 'PADDLING', subtitle: '桨板泛舟', themeColor: '#8E9A82' },
];

export const DEFAULT_STAMP_OPTIONS: StampOptions = {
  style: 'classic',
  margin: 0,
  holeRadius: 18,
  holeGap: 46,
  backgroundColor: '#FFFFFF',
  photoRadius: 0,
  shadow: true,
  backdropEnabled: false,
  backdropColor: '#FFF4DD',
};

const now = new Date();
const currentYear = String(now.getFullYear());
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

export const DEFAULT_TICKET_OPTIONS: TicketOptions = {
  orientation: 'horizontal',
  stationTitle: 'EXPLORE',
  stationSubtitle: '探索发现',
  subTitle: 'XIAOHONGSHU',
  year: currentYear,
  date: `${currentMonth}`,
  ticketNo: '2026',
  themeColor: '#D8CBB5',
  textColor: '#1A1410',
  photoRadius: 18,
  backdropEnabled: false,
  backdropColor: '#FFF4DD',
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
