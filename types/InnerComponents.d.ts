import {
  NullstackFunctionalComponent,
  NullstackClientContext
} from './index'

type RemoveContext<Params extends Record<string, any>, Prop> =
  Prop extends string
  ? Prop extends keyof NullstackClientContext
    ? (Params[Prop] extends NullstackClientContext[Prop] ? never : Prop)
    : Prop
  : 'never'

type ComponentProps<Params> = {
  [Prop in keyof Params as RemoveContext<Params, Prop>]: Params[Prop]
}

type GetMethod<Class extends Record<string, any>, MethodName> =
  MethodName extends string
  ? NullstackFunctionalComponent<
      ComponentProps<Parameters<Class[MethodName]>[0]>
    >
  : never

type GetName<Property> =
  Property extends `render` ? never :
  Property extends `render${infer Name}`
  ? (Property extends `render${Capitalize<Name>}` ? Name : never)
  : never

export type NullstackInners<Class extends Record<string, any>> = {
  [Property in keyof Class as GetName<Property>]:
    GetMethod<Class, Property>
}