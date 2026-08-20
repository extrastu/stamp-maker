import React, { useState, useEffect } from 'react';
import { AppStep, AspectRatioId, StampOptions, ImageItem } from './types';
import { DEFAULT_STAMP_OPTIONS } from './utils/constants';
import { loadPreferences, savePreferences } from './utils/storage';
import { Toast, ToastMessage } from './components/common/Toast';
import { StartView } from './components/start/StartView';
import { CropView } from './components/crop/CropView';
import { EditorView } from './components/editor/EditorView';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('start');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioId>('3:4');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [stampOptions, setStampOptions] = useState<StampOptions>(DEFAULT_STAMP_OPTIONS);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const prefs = loadPreferences();
    setSelectedRatio(prefs.ratioId);
    setStampOptions((prev) => ({
      ...prev,
      style: prefs.styleId,
      margin: prefs.margin,
      backgroundColor: prefs.backgroundColor,
      photoRadius: prefs.photoRadius,
    }));
  }, []);

  // Show toast notification
  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToast({
      id: String(Date.now()),
      type,
      text,
    });
  };

  // Step 1: User selects one or multiple images
  const handleImagesSelected = (items: { file: File; url: string }[]) => {
    const newItems: ImageItem[] = items.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      file: item.file,
      name: item.file.name,
      rawUrl: item.url,
      croppedUrl: null,
      croppedAreaPixels: null,
      ratioId: selectedRatio,
      rotation: 0,
    }));
    setImages(newItems);
    setCurrentStep('crop');
  };

  // Step 2: User completes cropping for all images
  const handleAllCropsComplete = (croppedImages: ImageItem[]) => {
    setImages(croppedImages);
    if (croppedImages.length > 0 && croppedImages[0].ratioId) {
      setSelectedRatio(croppedImages[0].ratioId);
      savePreferences({ ratioId: croppedImages[0].ratioId });
    }
    setCurrentStep('edit');
  };

  // Update Stamp Options & save to localStorage
  const handleStampOptionsChange = (newOptions: StampOptions) => {
    setStampOptions(newOptions);
    savePreferences({
      styleId: newOptions.style,
      margin: newOptions.margin,
      backgroundColor: newOptions.backgroundColor,
      photoRadius: newOptions.photoRadius,
    });
  };

  // Reset to start
  const handleReset = () => {
    images.forEach((img) => {
      if (img.rawUrl && img.rawUrl.startsWith('blob:')) {
        URL.revokeObjectURL(img.rawUrl);
      }
      if (img.croppedUrl && img.croppedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(img.croppedUrl);
      }
    });
    setImages([]);
    setCurrentStep('start');
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Main View Transition */}
      <main className="w-full">
        {currentStep === 'start' && (
          <StartView
            onImagesSelected={handleImagesSelected}
            onToast={showToast}
          />
        )}

        {currentStep === 'crop' && images.length > 0 && (
          <CropView
            images={images}
            initialRatio={selectedRatio}
            onBack={handleReset}
            onAllCropsComplete={handleAllCropsComplete}
          />
        )}

        {currentStep === 'edit' && images.length > 0 && (
          <EditorView
            images={images}
            options={stampOptions}
            onOptionsChange={handleStampOptionsChange}
            onBackToCrop={() => setCurrentStep('crop')}
            onResetToHome={handleReset}
            originalFileName={images[0]?.name}
            onToast={showToast}
          />
        )}
      </main>

      {/* Toast Alert */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default App;
