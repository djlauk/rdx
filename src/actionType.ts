export const actionType = (name: string, key: string) => key.indexOf('/') > -1 ? key : name + '/' + key