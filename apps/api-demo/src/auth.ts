import type { FastifyReply, FastifyRequest } from "fastify";

export function requireApiKey(expectedKey: string) {
  return function authGuard(request: FastifyRequest, reply: FastifyReply): void {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      void reply.code(401).send({ error: "Falta Authorization: Bearer" });
      return;
    }
    const token = header.slice("Bearer ".length).trim();
    if (token !== expectedKey) {
      void reply.code(403).send({ error: "Token inválido" });
      return;
    }
  };
}
