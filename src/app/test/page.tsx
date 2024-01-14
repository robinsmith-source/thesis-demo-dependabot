import { decode, encode } from "@auth/core/jwt";

import { PrismaClient } from "@prisma/client";

export default async function Test() {
  const prisma = new PrismaClient();
  const account = await prisma.user.upsert({
    where: {
      email: `testing${1}@example.com`,
    },
    create: {
      name: `Testing ${1}`,
      email: `testing${1}@example.com`,
    },
    update: {},
  });

  const token = await encode({
    salt: `salt`,
    secret: process.env.AUTH_SECRET as string,
    maxAge: 1000 * 60 * 60,
    token: {
      name: account.name,
      email: account.email,
      picture: "https://placekitten.com/400/400",
      sub: account.id,
      jti: "3b861310-d8d8-481e-ad9e-25cbd7e1e3df",
    },
  });

  const decoded = await decode({
    salt: `salt`,
    secret: process.env.AUTH_SECRET as string,
    token:
      "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..NC6rZzWkCZLfLi58.-em0uNB1OiVPQNbfik1x2JoA0A244L3i9yQ_CFGHbo-5thb_Ns9J2RZpSoMU0WiYpH-Qee7Y6F9KIoFUzZgVrkL_nf0-Xjlgh6FFO40Nz4_DoMR2WFnpiM4CA4ghBv3yH3pCqLEclEoy_--9y9O3BCxEqHYWOwSj-u7sqJgTdjK0GjlgymuuMbFz2zt1tPRNy2mKhO13YPXqETeTKdhyA-TQqahpLUeWDj7fla5qLy0bRB0zzl7SwoTSHPqOLe70oWHpD4Go2eiBtYazfbT45w.XlBrgKrai822WhDLUToQpA",
  });

  return (
    <div>
      <p>{token}</p>
      <br />
      <p>{JSON.stringify(decoded)}</p>
    </div>
  );
}
