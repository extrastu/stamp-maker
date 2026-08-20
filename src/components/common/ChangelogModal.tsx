import React from 'react';
import { X, Sparkles, Calendar } from 'lucide-react';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReleaseItem {
  version: string;
  date: string;
  isLatest?: boolean;
  title: string;
  highlights: {
    icon: string;
    label: string;
    desc: string;
  }[];
}

const CHANGELOG_DATA: ReleaseItem[] = [
  {
    version: 'v1.0.3',
    date: '2026.08.20',
    isLatest: true,
    title: '双模式创作升级 & 旅行票根横竖双版式',
    highlights: [
      {
        icon: '🎫',
        label: '复古旅行票根模式',
        desc: '新增旅行票根模式，支持上下/左右卡槽凹槽缺口、圆角相片、站点站名、日期时间戳与真实防伪条形码。',
      },
      {
        icon: '↔️',
        label: '横竖双版式自由切换',
        desc: '票根模式支持横版车票（左相片右存根）与竖版存根，内置 9 款目的地复古纸张底色与一键快捷填词。',
      },
      {
        icon: '📑',
        label: '多图批量处理与发布',
        desc: '支持一次性选择多张照片连续裁切，支持一键批量保存全部邮票，或一键打包发布小红书多图图文。',
      },
      {
        icon: '✂️',
        label: '满幅 0 留白咬合打孔',
        desc: '支持齿孔直接咬合在照片边缘，画面满幅呈现，视觉张力十足。',
      },
    ],
  },
  {
    version: 'v1.0.2',
    date: '2026.08.19',
    title: '小红书生态原生集成 & 体验优化',
    highlights: [
      {
        icon: '📕',
        label: '小红书图文一键直发',
        desc: '深度接入小红书 JSBridge postNote 能力，一键将制作好的邮票带入小红书图文发布器。',
      },
      {
        icon: '🧭',
        label: '自适应环境剪贴板',
        desc: '小红书容器内一键复制链接，普通 Web 浏览器原生打开新标签页。',
      },
    ],
  },
  {
    version: 'v1.0.0',
    date: '2026.08.18',
    title: 'Stamp Maker 初始版本发布',
    highlights: [
      {
        icon: '💌',
        label: '真实物理齿孔镂空算法',
        desc: '基于 Canvas destination-out 复合运算，100% 纯本地离线生成逼真透明齿孔邮票。',
      },
      {
        icon: '📐',
        label: '多比例裁剪与旋转回正',
        desc: '支持 1:1、3:4、4:3、2:3、9:16 画幅构图，支持一键 90° 旋转与 0° 回正。',
      },
    ],
  },
];

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-paper w-full max-w-md rounded-3xl shadow-neo-xl border-2 border-ink overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-ink flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-xl bg-sun border-2 border-ink shadow-neo-sm text-sm">
              📜
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] text-ink leading-tight">更新日志</h3>
              <p className="text-[10.5px] text-ink-2 mt-0.2 font-mono">Changelog & Release Notes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full bg-paper border-2 border-ink shadow-neo-sm btn-neo text-ink hover:bg-rose transition-colors"
            aria-label="关闭"
          >
            <X className="size-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Philosophical Opening Quote */}
          <div className="p-3 rounded-2xl bg-card border-2 border-ink shadow-neo-sm relative overflow-hidden">
            <div className="flex items-start gap-2">
              <Sparkles className="size-4 text-accent shrink-0 mt-0.5" />
              <blockquote className="text-[11.5px] font-bold text-ink italic leading-relaxed">
                “ 每一张照片都是时间的切片，齿孔与票根将流逝的瞬间，定格成永恒的信笺。”
              </blockquote>
            </div>
          </div>

          {/* Timeline List */}
          <div className="space-y-3.5">
            {CHANGELOG_DATA.map((release) => (
              <div
                key={release.version}
                className="p-3.5 rounded-2xl bg-card border-2 border-ink shadow-neo-sm space-y-2 relative"
              >
                {/* Version Title & Badge */}
                <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-ink bg-sun px-2 py-0.5 rounded-lg border-2 border-ink shadow-neo-sm">
                      {release.version}
                    </span>
                    <span className="text-xs font-extrabold text-ink">{release.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-ink-3">
                    <Calendar className="size-3" />
                    <span>{release.date}</span>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-1.5 pt-0.5">
                  {release.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-left">
                      <span className="text-xs shrink-0 mt-0.5">{item.icon}</span>
                      <div className="text-[11px] leading-snug">
                        <span className="font-extrabold text-ink mr-1">{item.label}：</span>
                        <span className="text-ink-2 font-medium">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-3.5 border-t-2 border-ink bg-card shrink-0 safe-bottom">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-9 rounded-xl bg-sun hover:bg-sun-tint text-ink font-extrabold text-xs flex items-center justify-center gap-1 border-2 border-ink shadow-neo btn-neo transition-all"
          >
            <span>知道了，开始制作 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
