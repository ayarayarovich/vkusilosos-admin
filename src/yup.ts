import * as yup from "yup";
import type { AnyObject, Maybe, ObjectSchema } from "yup/index";

// declare module "yup" {
//   interface ObjectSchema<
//     TType extends AnyObject = AnyObject,
//     TContext extends AnyObject = AnyObject,
//     TOut extends TType = TType
//   > extends yup.BaseSchema<TType, TContext, TOut> {
//     atLeastOneIsTrueOf(list: string[]): ObjectSchema<TType, TContext>;
//   }
// }

yup.addMethod(yup.object, 'atLeastOneIsTrueOf', function(list) {
  return this.test({
    name: 'atLeastOneIsTrueOf',
    message: 'Должен быть выбран как минимум один из этих ключей: ${keys}',
    exclusive: true,
    params: { keys: list.join(', ') },
    test: value => value == null || list.some((f: any) => !!value[f])
  })
})

export default yup;