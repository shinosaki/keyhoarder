export const store = async (c, data, type = 'kv') => {
  switch (type) {
    case 'kv': {
      const exist = await c.kv.get('data', { type: 'json' });
      const dedup = exist?.filter(v =>
        !data.map(h => h.main.fingerprint).includes(v.main.fingerprint)
      );
      return await c.kv.put('data', JSON.stringify(
        (!exist) ? data : [...dedup, ...data]
      ));
    };

    default:
      throw new Error('Invalid "type" argument in store()');
  };
};

export const query = async (c, str) => {
  const data = await c.kv.get('data', { type: 'json' });

  if (str.startsWith('0x')) {
    str = str.replace('0x', '');

    return data.filter(({ main, subs }) =>
      main.fingerprint.endsWith(str)
      || subs.some(v => v.fingerprint.endsWith(str))
    );
  } else {
    return data.filter(({ userIDs }) => userIDs.some(v => v.includes(str)));
  };
};
