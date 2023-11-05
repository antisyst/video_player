import React, { useState, useRef, useEffect } from 'react';
import 'react-resizable/css/styles.css';

import AssetComponent from './components/Asset';
import ControlPanel from './components/ControlPanel';

interface Asset {
  id: number;
  type: 'image' | 'video';
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
  playing: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

function App() {
  const [assetInfo, setAssetInfo] = useState<string>('');
  const [inputUrl, setInputUrl] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const assetInfoString = assets
      .map((asset) => {
        const { id, x, y, width, height } = asset;
        return `Asset ID: ${id}, X: ${x}px, Y: ${y}px, Width: ${width}px, Height: ${height}px`;
      })
      .join('\n');
    setAssetInfo(assetInfoString);
  }, [assets]);

  const addAsset = (url: string) => {
    if (!url) return;
    const type = url.endsWith('.mp4') ? 'video' : 'image';
    const aspectRatio = 1; // Replace with actual aspect ratio calculation
    const videoRef = React.createRef<HTMLVideoElement>();
    const newAsset: Asset = {
      id: Date.now(),
      type,
      url,
      x: 50,
      y: 50,
      width: 500,
      height: 200 / aspectRatio,
      aspectRatio,
      playing: false,
      videoRef,
    };
    setAssets([...assets, newAsset]);
  };

  const deleteAsset = (id: number) => {
    const updatedAssets = assets.filter((asset) => asset.id !== id);
    setAssets(updatedAssets);
    setSelectedAsset(null);
  };

  const toggleVideoPlayback = (id: number) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id === id) {
          const video = asset.videoRef.current;
          if (video) {
            if (asset.playing) {
              video.pause();
            } else {
              video.play();
            }
          }
          return { ...asset, playing: !asset.playing };
        }
        return asset;
      })
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  const handleAddAsset = () => {
    addAsset(inputUrl);
    setInputUrl('');
  };

  const handleMouseDown = (id: number) => {
    setSelectedAsset(id);
  };

  const handleMouseUp = () => {
    setSelectedAsset(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectedAsset !== null) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setAssets((prev) =>
          prev.map((asset) =>
            asset.id === selectedAsset
              ? { ...asset, x, y }
              : { ...asset }
          )
        );
      }
    }
  };

  const handleResize = (id: number, size: { width: number; height: number }) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id
          ? {
              ...asset,
              width: size.width,
              height: size.height,
            }
          : asset
      )
    );
  };
  

  const logAssetInfo = () => {
    assets.forEach((asset) => {
      console.log(
        `Asset ID: ${asset.id}, X: ${asset.x}, Y: ${asset.y}, Width: ${asset.width}, Height: ${asset.height}`
      );
    });
  };

  return (
    <div className="App">
      <div className='asset_info'>
      <pre>{assetInfo}</pre>
      </div>
      <ControlPanel
        inputUrl={inputUrl}
        handleInputChange={handleInputChange}
        handleAddAsset={handleAddAsset}
        logAssetInfo={logAssetInfo}
      />
      <div
        className="canvas"
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
      {assets.map((asset) => (
        <AssetComponent
          key={asset.id}
          asset={asset}
          selectedAsset={selectedAsset}
          onDelete={deleteAsset}
          onTogglePlayback={toggleVideoPlayback}
          onResize={handleResize}
          onMouseDown={() => handleMouseDown(asset.id)} 
          />
      ))}
      </div>
    </div>
  );
}

export default App;
