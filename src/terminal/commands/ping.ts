import type { Command } from '../types';

const ping: Command = {
  name: 'ping',
  description: 'ping: send ICMP echo requests  —  `ping <host>`',
  execute(argv) {
    const host = argv[0] ?? 'localhost';
    return {
      program: {
        name: 'ping',
        async run(ctx) {
          ctx.print(`PING ${host}: 56 data bytes`);
          let seq = 0;
          while (!ctx.signal.aborted) {
            const start = Date.now();
            await ctx.sleep(1000);
            const ms = Date.now() - start;
            ctx.print(`64 bytes from ${host}: icmp_seq=${seq++} ttl=64 time=${ms} ms`);
          }
        },
      },
    };
  },
};

export default ping;
