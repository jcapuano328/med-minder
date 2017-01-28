import { transform } from 'babel-core';

export default function(source) {    
    return transform(source, {presets: ['es2015']}).code;
}