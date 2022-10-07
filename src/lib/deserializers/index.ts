// import decodeLayoutV1 from "./v1";
import decodeLayoutV2 from "./v2";

const Deserializers = new Map([
    // ["v1", decodeLayoutV1],
    ["v2", decodeLayoutV2],
]);

export default Deserializers
