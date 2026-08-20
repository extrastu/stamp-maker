export interface XhsMiniTool {
  writeTempFile(options: {
    data: string; // 完整 data:uri (如 data:image/png;base64,...)
    success?: (res: { filePath: string; errMsg?: string }) => void;
    fail?: (err: { errMsg: string; errCode?: number }) => void;
    complete?: (res: any) => void;
  }): Promise<{ filePath: string; errMsg?: string }>;

  saveImageToPhotosAlbum(options: {
    filePath: string; // base64 data:uri 或 writeTempFile 返回的本地路径
    success?: (res: { errMsg?: string }) => void;
    fail?: (err: { errMsg: string; errCode?: number }) => void;
    complete?: (res: any) => void;
  }): Promise<{ errMsg?: string }>;

  postNote(options: {
    title?: string;
    content?: string;
    pageType?: 'video_publish' | 'photo_publish' | 'slides_edit';
    mediaInfo: {
      image_resources?: { url: string }[];
      video_resources?: { video_url: string; cover_url?: string };
      live_photo_resources?: { url: string; video_url: string }[];
    };
    tags?: string;
    success?: (res: { errMsg?: string }) => void;
    fail?: (err: { errMsg: string; errCode?: number }) => void;
    complete?: (res: any) => void;
  }): Promise<{ errMsg?: string }>;

  openRedPage(options: {
    type: string;
    params?: Record<string, any>;
    success?: (res: { errMsg?: string }) => void;
    fail?: (err: { errMsg: string; errCode?: number }) => void;
    complete?: (res: any) => void;
  }): Promise<{ errMsg?: string }>;
}

declare global {
  interface Window {
    xhs?: {
      miniTool?: XhsMiniTool;
    };
  }
}
