import React, { useRef, useState } from 'react';
import styled from 'styled-components';

interface MobileVideoProps {
  src: string;
  poster?: string;
  caption?: string;
}

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StyledVideo = styled.video`
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  background: #000;
`;

const PlayButton = styled.button<{ $isVisible: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: 3px solid white;
  cursor: pointer;
  display: ${({ $isVisible }) => $isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translate(-50%, -50%) scale(1.1);
  }

  &::after {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 0 10px 18px;
    border-color: transparent transparent transparent white;
    margin-left: 3px;
  }
`;

const VideoCaption = styled.p`
  font-style: italic;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const MobileVideo: React.FC<MobileVideoProps> = ({ src, poster, caption }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused || videoRef.current.ended) {
        // Reset video if ended
        if (videoRef.current.ended) {
          videoRef.current.currentTime = 0;
        }
        
        // Force load on mobile
        videoRef.current.load();
        
        // Play with error handling
        await videoRef.current.play();
        setIsPlaying(true);
        setShowPlayButton(false);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayButton(true);
      }
    } catch (error) {
      console.error('Video play error:', error);
      // Fallback: reload and try again
      videoRef.current.load();
      setTimeout(() => {
        videoRef.current?.play().catch(() => {
          console.error('Video play failed after reload');
        });
      }, 100);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setShowPlayButton(true);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setShowPlayButton(false);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setShowPlayButton(true);
  };

  return (
    <VideoWrapper>
      <StyledVideo
        ref={videoRef}
        controls={!showPlayButton}
        controlsList="nodownload"
        playsInline
        webkit-playsinline="true"
        muted={false}
        preload="none"
        poster={poster}
        onEnded={handleVideoEnded}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onClick={handleVideoClick}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </StyledVideo>
      <PlayButton 
        $isVisible={showPlayButton && !isPlaying} 
        onClick={handleVideoClick}
        aria-label="Play video"
      />
      {caption && <VideoCaption>{caption}</VideoCaption>}
    </VideoWrapper>
  );
};