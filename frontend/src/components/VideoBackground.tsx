import React from 'react';
import styled from 'styled-components';

const VideoContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
`;

const BackgroundVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
`;

const VideoBackground: React.FC = () => {
  return (
    <VideoContainer>
      <BackgroundVideo autoPlay muted loop playsInline>
        <source src="/202587-918431513_small.mp4" type="video/mp4" />
      </BackgroundVideo>
      <VideoOverlay />
    </VideoContainer>
  );
};

export default VideoBackground;