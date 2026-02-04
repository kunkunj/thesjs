import { defaultCamera, defaultLight, defaultAmbient } from '../../data/option';
import { Thes } from '../thes';
export default function (th: Record<keyof any, any>) {
  th.getDefaultCameraOptions = defaultCamera;
  th.getDefaultLightOptions = defaultLight;
  th.getDefaultAmbientOptions = defaultAmbient;
  th.options = {
    defaultCamera,
    defaultLight,
    defaultAmbient,
  };
}
