import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { StrictMode } from 'react';


interface AssetProps {
  asset: Asset;
  selectedAsset: number | null;
  onDelete: (id: number) => void;
  onTogglePlayback: (id: number) => void;
  onResize: (id: number, size: { width: number; height: number }) => void;
  onMouseDown: (id: number) => void; 
}

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

function Asset({ asset, onDelete, onTogglePlayback, onResize, selectedAsset }: AssetProps) {
  const aspectRatio = asset.aspectRatio;
  
  const draggableRef = useRef(null);
  const resizableRef = useRef(null);

  return (
    <StrictMode>
    <Draggable
      defaultPosition={{ x: asset.x, y: asset.y }}
      ref={draggableRef}
    >
      <div className={`asset ${selectedAsset === asset.id ? 'selected' : ''}`}>
        <button onClick={() => onDelete(asset.id)} className='delete_button'><AiFillDelete/></button>
        {asset.type === 'video' && (
          <button onClick={() => onTogglePlayback(asset.id)} className='main_action_button'>
            {asset.playing ? <BsPauseFill/> : <BsPlayFill/> }
          </button>
        )}
        <Resizable
          width={asset.width}
          height={asset.height}
          onResize={(e, data) => {
            console.log(e);
            const newWidth = data.size.width;
            const newHeight = newWidth / aspectRatio;
            onResize(asset.id, { width: newWidth, height: newHeight });
          }}
          handle={<div className="resize-handle" />}
          ref={resizableRef}
        >
          {asset.type === 'image' ? (
            <div className="image-container">
              <img src={asset.url} alt="Image" />
            </div>
          ) : (
            <div className="video-container">
              <video
                ref={asset.videoRef}
                src={asset.url}
                autoPlay={false}
                controls={false}
                draggable={false}
              />
            </div>
          )}
        </Resizable>
      </div>
    </Draggable>
    </StrictMode>
  );
}

export default Asset;
