type stdout = "inherit" | "piped" | "null" | number;
type stderr = "inherit" | "piped" | "null" | number;
type stdin = "inherit" | "piped" | "null" | number;

const decode = (val: Uint8Array) => new TextDecoder().decode(val);

function remove_multiple_whitespace(value: string): string[] {
  const values = value.split(" ");
  return values.filter((val) => val.length !== 0);
}

/** Write simple shell command like a string
 *
 *      cmd("ls .")
 *      const out = cmd("ls .", "piped","piped")
 *      console.log(out)
 *
 * Write like a script line by line with await
 *
 *      await cmd("ls .")
 * */
export async function cmd(value: string, stdout?: stdout, stderr?: stdout) {
  const removed = remove_multiple_whitespace(value);

  const p = Deno.run(
    { "cmd": removed, stdout: stdout, stderr: stderr },
  );

  const { code } = await p.status();

  if (stdout === "piped" && stderr === "piped") {
    const out = await p.output();
    return decode(out);
  }
}
