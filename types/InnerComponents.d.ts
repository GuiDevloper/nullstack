import Nullstack, {
  NullstackFunctionalComponent,
  NullstackClientContext
} from './index'

type RemoveContext<Params extends Record<string, any>, Prop> =
  Prop extends string
  ? Prop extends keyof NullstackClientContext
    ? (Params[Prop] extends NullstackClientContext[Prop] ? never : Prop)
    : Prop
  : 'never'

type ComponentProps<Params extends Record<string, any>> = {
  [Prop in keyof Params as RemoveContext<Params, Prop>]: Params[Prop]
}

type GetMethod<Class extends Record<string, any>, MethodName> =
  MethodName extends string
  ? NullstackFunctionalComponent<
      Parameters<Class[MethodName]>[0] extends Record<string, any>
      ? ComponentProps<Parameters<Class[MethodName]>[0]>
      : Record<string, any>
    >
  : never

type GetName<Class extends Record<string, any>, Property> =
  Property extends `render` ? never :
  Property extends `render${infer Name}`
  ? Property extends `render${Capitalize<Name>}`
    ? (Class[Property] extends Nullstack['render'] ? Name : never)
    : never
  : never

export type NullstackInners<Class extends Record<string, any>> = {
  [Property in keyof Class as GetName<Class, Property>]:
    GetMethod<Class, Property>
}