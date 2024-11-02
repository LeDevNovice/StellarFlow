import { Howl } from 'howler';

import vesselArrivedSoundFile from '../assets/audio/vesselArrived.wav';
import vesselFailureSoundFile from '../assets/audio/vesselFailure.wav'
import bounceSoundFile from '../assets/audio/bounce.wav';
import shotSoundFile from '../assets/audio/shot.wav'
import collisionSoundFile from '../assets/audio/collision.wav'

const soundManager = {
  vesselArrived: new Howl({
    src: [vesselArrivedSoundFile],
    volume: 1,
  }),
  vesselFailure: new Howl({
    src: [vesselFailureSoundFile],
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
  collision: new Howl({
    src: [collisionSoundFile],
    volume: 1,
  }),
};

export default soundManager;
