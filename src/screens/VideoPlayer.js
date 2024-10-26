import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, StatusBar } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { useRoute,useNavigation } from '@react-navigation/native';

const VideoPlayer = () => {
  const route = useRoute();
  const { isYouTube, videoId, videoUrl } = route.params;
  const [playing, setPlaying] = useState(true);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    // Lock to landscape for video playback
    Orientation.lockToLandscape();
    StatusBar.setHidden(true, 'fade');

    return () => {
      // Unlock orientation and show status bar when video is closed
      Orientation.lockToPortrait();
      StatusBar.setHidden(false, 'fade');
    };
  }, []);

  return (
    <View style={styles.container} key={`${width}-${height}`}>
      {isYouTube ? (
        <YoutubeIframe
          height={height}
          width={width}
          play={playing}
          videoId={videoId}
          onChangeState={(event) => {
            if (event === 'ended') {
              setPlaying(false);
            }
          }}
        />
      ) : (
        <Video
          source={{ uri: videoUrl }}   // Video from your local backend
          style={{ width, height }}
          resizeMode="contain"         // Adjust the video size within the container
          controls={true}              // Show play/pause controls, fullscreen toggle, etc.
          onError={(error) => console.log('Video Error:', error)}  // Capture video loading errors
          onLoad={(data) => console.log('Video Loaded:', data)}    // Video has loaded successfully
          onBuffer={(buffer) => console.log('Buffering:', buffer)} // Buffering state for video
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default VideoPlayer;
