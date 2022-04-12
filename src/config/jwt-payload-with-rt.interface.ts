import { JwtPayload } from './jwt-payload.interface';

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };