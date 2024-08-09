import decodeLayoutV1 from './v1';
import decodeLayoutV2 from './v2';
import decodeLayoutV3 from './v3';

const Deserializer = new Map([
  ['v1', decodeLayoutV1],
  ['v2', decodeLayoutV2],
  ['v3', decodeLayoutV3],
]);

export default Deserializer;
