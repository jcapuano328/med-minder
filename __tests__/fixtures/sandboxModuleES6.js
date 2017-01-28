import sandbox from 'sandboxed-module';
import transformES6 from './transformES6';

export default function(module, options) {
    let opts = {
        ...options,
        sourceTransformers: {transformES6}
    };
    return sandbox.require(module, opts);
}