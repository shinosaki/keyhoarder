import { z } from 'zod';

const onoff = v =>  (v === 'on') ? true : (v === 'off') ? false : null;

export const schema = {
  // wkd: {
  //   advanced: z.object({
  //     domain: z.string(),
  //     wkdID: z.string().regex(/[a-km-uw-zA-KM-UW-Z13-9]{32}/)
  //   }),
  //   direct: z.object({
  //     wkdID: z.string().regex(/[a-km-uw-zA-KM-UW-Z13-9]{32}/)
  //   })
  // },

  add: z.object({
    keytext: z.string().min(71)
  }),

  search: z.object({
    q: z.string()
  }),

  lookup: z.object({
    op: z.union([
      z.literal('get'),
      z.literal('index'),
      z.literal('vindex')
    ]).default('get'),
    search: z.string(),
    // search: z.union([
    //   z.string().email(),
    //   z.string().startsWith('0x').length(8 + 2),
    //   z.string().startsWith('0x').length(16 + 2),
    //   z.string().startsWith('0x').length(32 + 2),
    //   z.string().startsWith('0x').length(40 + 2),
    //   z.string().regex(/^(0x\w{8}|\w{16}|\w{32}|\w{40})$/i),
    // ]),
    options: z.preprocess(
      v => v.split(','),
      z.array(
        z.union([
          z.literal('mr'),
          z.literal('nm'),
          z.literal('json'),
          z.literal('x-json'),
        ])
      )
    ).optional(),
    fingerprint: z.preprocess(onoff, z.boolean()).optional(),
    exact: z.preprocess(onoff, z.boolean()).optional()
  })
};
