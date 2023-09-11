import { defaultCamera, defaultLight, defaultAmbient } from '../../data/option';
export default function (th: any) {
  th.getDefaultCameraOptions = defaultCamera;
  th.getDefaultLightOptions = defaultLight;
  th.getDefaultAmbientOptions = defaultAmbient;
  th.options = {
    defaultCamera,
    defaultLight,
    defaultAmbient,
  };
}
