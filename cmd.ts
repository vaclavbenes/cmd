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
 *
 * Write like a script line by line with await
 *
 *      const { code } = await cmd("ls .");
 *      console.log(code);
 *
 *      const { code, stdout, stderr } = await cmd("ls .", "piped", "piped");
 *      console.log(code);
 *
 **/
export async function cmd(value: string, stdout?: stdout, stderr?: stdout) {
  const removed = remove_multiple_whitespace(value);

  const p = Deno.run(
    { "cmd": removed, stdout: stdout, stderr: stderr },
  );

  const { code } = await p.status();

  if (stdout === "piped" && stderr === "piped") {
    const out = await p.output();
    const err = await p.stderrOutput();
    return { code, stdout: decode(out), stderr: decode(err) };
  }

  return { code };
}

const { code, stdout, stderr } = await cmd("ls .", "piped", "piped");
console.log(code);
