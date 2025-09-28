'use client';

import type React from 'react';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, FlashlightIcon, RotateCcw, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  className?: string;
}

export function QRScanner({ onScan, onClose, className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment'
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      setHasPermission(true);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (error) {
      console.error('Camera permission denied:', error);
      setHasPermission(false);
    }
  }, [facingMode]);

  useEffect(() => {
    requestCameraPermission();
    return () => {
      stopCamera();
    };
  }, [requestCameraPermission]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && 'applyConstraints' in track) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled } as MediaTrackConstraintSet],
          });
          setFlashEnabled(!flashEnabled);
        } catch (error) {
          console.error('Flash not supported:', error);
        }
      }
    }
  };

  const switchCamera = async () => {
    stopCamera();
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (error) {
      console.error('Failed to switch camera:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would process the image to extract QR code
      // For demo purposes, we'll simulate a successful scan
      setTimeout(() => {
        onScan('tomato-001'); // Simulate scanning the sample product
      }, 1000);
    }
  };

  // Simulate QR code detection (in a real app, you'd use a QR code library)
  const simulateScan = () => {
    // Simulate successful scan after 2 seconds
    setTimeout(() => {
      onScan('tomato-001');
    }, 2000);
  };

  if (hasPermission === null) {
    return (
      <Card className={cn('w-full max-w-md mx-auto', className)}>
        <CardContent className='p-8 text-center space-y-4'>
          <Camera className='w-12 h-12 mx-auto text-muted-foreground' />
          <p className='text-muted-foreground'>
            Requesting camera permission...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (hasPermission === false) {
    return (
      <Card className={cn('w-full max-w-md mx-auto', className)}>
        <CardContent className='p-8 text-center space-y-6'>
          <Camera className='w-12 h-12 mx-auto text-muted-foreground' />
          <div className='space-y-2'>
            <h3 className='font-semibold'>Camera Access Required</h3>
            <p className='text-muted-foreground text-sm'>
              Please allow camera access to scan QR codes. You can also upload
              an image instead.
            </p>
          </div>
          <div className='space-y-3'>
            <Button onClick={requestCameraPermission} className='w-full'>
              <Camera className='w-4 h-4 mr-2' />
              Enable Camera
            </Button>
            <div className='relative'>
              <input
                aria-label='Upload QR code image'
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              />
              <Button variant='outline' className='w-full bg-transparent'>
                <Upload className='w-4 h-4 mr-2' />
                Upload QR Image
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full max-w-md mx-auto overflow-hidden', className)}>
      <div className='relative'>
        {/* Camera View */}
        <div className='relative aspect-square bg-black'>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className='w-full h-full object-cover'
            onClick={simulateScan} // Demo: click to simulate scan
          />

          {/* Scanning Overlay */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='relative'>
              {/* Scanning Frame */}
              <div className='w-64 h-64 border-2 border-primary rounded-lg relative'>
                <div className='absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg' />
                <div className='absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg' />
                <div className='absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg' />
                <div className='absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg' />

                {/* Scanning Line Animation */}
                <div className='absolute inset-x-0 top-0 h-1 bg-primary animate-pulse' />
              </div>

              {/* Instructions */}
              <div className='absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center'>
                <p className='text-white text-sm bg-black/50 px-3 py-1 rounded-full'>
                  Position QR code within frame
                </p>
              </div>
            </div>
          </div>

          {/* Demo Instructions */}
          <div className='absolute top-4 left-4 right-4'>
            <div className='bg-black/70 text-white text-xs p-2 rounded-lg text-center'>
              Demo: Tap anywhere to simulate QR scan
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className='absolute bottom-4 left-4 right-4 flex items-center justify-between'>
          <Button
            variant='secondary'
            size='sm'
            onClick={toggleFlash}
            className='bg-black/50 hover:bg-black/70'
          >
            <FlashlightIcon
              className={cn('w-4 h-4', flashEnabled && 'text-yellow-400')}
            />
          </Button>

          <div className='flex gap-2'>
            <Button
              variant='secondary'
              size='sm'
              onClick={switchCamera}
              className='bg-black/50 hover:bg-black/70'
            >
              <RotateCcw className='w-4 h-4' />
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={onClose}
              className='bg-black/50 hover:bg-black/70'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Alternative Upload */}
      <CardContent className='p-4 border-t'>
        <div className='relative'>
          <input
            aria-label='Upload QR code image'
            type='file'
            accept='image/*'
            onChange={handleFileUpload}
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          />
          <Button variant='outline' className='w-full bg-transparent'>
            <Upload className='w-4 h-4 mr-2' />
            Upload QR Image Instead
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
