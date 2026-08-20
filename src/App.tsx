import React, { useState, useEffect } from 'react';
import { Area } from 'react-easy-crop';
import { AppStep, AspectRatioId, StampOptions, ImageState } from './types';
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

  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    name: '',
    rawUrl: null,
    croppedUrl: null,
    croppedAreaPixels: null,
  });

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

  // Step 1: User selects an image or sample
  const handleImageSelected = (file: File, url: string) => {
    setImageState({
      file,
      name: file.name,
      rawUrl: url,
      croppedUrl: null,
      croppedAreaPixels: null,
    });
    setCurrentStep('crop');
  };

  // Step 2: User completes crop
  const handleCropComplete = (
    croppedUrl: string,
    pixelCrop: Area,
    ratioId: AspectRatioId
  ) => {
    setImageState((prev) => ({
      ...prev,
      croppedUrl,
      croppedAreaPixels: pixelCrop,
    }));
    setSelectedRatio(ratioId);
    savePreferences({ ratioId });
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
    if (imageState.rawUrl && imageState.rawUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageState.rawUrl);
    }
    if (imageState.croppedUrl && imageState.croppedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageState.croppedUrl);
    }
    setImageState({
      file: null,
      name: '',
      rawUrl: null,
      croppedUrl: null,
      croppedAreaPixels: null,
    });
    setCurrentStep('start');
  };

  return (
    <div className={`min-h-screen transition-colors ${currentStep === 'crop' ? 'bg-[#141418]' : 'bg-[#FAF8F5]'}`}>
      {/* Main View Transition */}
      <main className="w-full">
        {currentStep === 'start' && (
          <StartView onImageSelected={handleImageSelected} />
        )}

        {currentStep === 'crop' && imageState.rawUrl && (
          <CropView
            imageUrl={imageState.rawUrl}
            initialRatio={selectedRatio}
            onBack={handleReset}
            onCropComplete={handleCropComplete}
          />
        )}

        {currentStep === 'edit' && imageState.croppedUrl && (
          <EditorView
            croppedImageUrl={imageState.croppedUrl}
            options={stampOptions}
            onOptionsChange={handleStampOptionsChange}
            onBackToCrop={() => setCurrentStep('crop')}
            originalFileName={imageState.name}
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
