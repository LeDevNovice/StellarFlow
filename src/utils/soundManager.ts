import { Howl } from 'howler';

import vesselArrivedSoundFile from '../assets/audio/vesselArrived.wav';
import bounceSoundFile from '../assets/audio/bounce.wav';
import shotSoundFile from '../assets/audio/shot.wav'

const soundManager = {
  vesselArrived: new Howl({
    src: [vesselArrivedSoundFile],
    volume: 1,
  }),
  bounce: new Howl({
    src: [bounceSoundFile],
    volume: 1,
  }),
  shot: new Howl({
    src: [shotSoundFile],
    volume: 1,
  }),
};

export default soundManager;
