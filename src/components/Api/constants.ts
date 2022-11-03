export enum ItemType {
  CLASS = 'Class',
  ENUMERATION = 'Enumeration',
  FUNCTION = 'Function',
  VAR = 'Variable',
  TYPE_ALIAS = 'Type alias',
  INTERFACE = 'Interface',
}
export enum Kinds {
  MODULE = 1,
  ENUM = 4,
  CLASS = 128,
  INTERFACE = 256,
  TYPE_ALIAS = 4194304,
  FUNCTION = 64,
  PROPERTY = 1024,
  CONSTRUCTOR = 512,
  ACCESSOR = 262144,
  METHOD = 2048,
  GET_SIGNATURE = 524288,
  SET_SIGNATURE = 1048576,
  PARAMETER = 32768,
  TYPE_PARAMETER = 131072,
}
