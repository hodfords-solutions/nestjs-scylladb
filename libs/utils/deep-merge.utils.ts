import merge from 'deepmerge';

export function mergeDeep(target, sources): object {
    return merge(target, sources);
}
